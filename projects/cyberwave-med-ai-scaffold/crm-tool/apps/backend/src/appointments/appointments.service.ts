import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

type GoogleTokenState = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

@Injectable()
export class AppointmentsService {
  private readonly tokenSource = 'google-calendar';
  private readonly authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly tokenUrl = 'https://oauth2.googleapis.com/token';
  private readonly calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars';
  private readonly calendarScope = 'https://www.googleapis.com/auth/calendar.events';

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  connectToGoogleCalendar() {
    const params = new URLSearchParams({
      client_id: this.getRequiredEnv('GOOGLE_CLIENT_ID'),
      redirect_uri: this.getRequiredEnv('GOOGLE_REDIRECT_URI'),
      response_type: 'code',
      scope: this.calendarScope,
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
    });

    return {
      url: `${this.authUrl}?${params.toString()}`,
    };
  }

  async handleGoogleCallback(code?: string) {
    if (!code) {
      throw new BadRequestException('Missing Google authorization code.');
    }

    const token = await this.saveTokenResponse(
      await this.exchangeCodeForToken(code),
    );

    return {
      connected: true,
      expiresAt: token.expiresAt,
      scope: token.scope,
    };
  }

  async getGoogleCalendarConnectionStatus() {
    const token = await this.prisma.appointmentServiceToken.findUnique({
      where: {
        source: this.tokenSource,
      },
      select: {
        accessToken: true,
        refreshToken: true,
        expiresAt: true,
        scope: true,
      },
    });

    return {
      connected: Boolean(token?.accessToken && token.expiresAt),
      canRefresh: Boolean(token?.refreshToken),
      expiresAt: token?.expiresAt,
      scope: token?.scope,
    };
  }

  async getGoogleCalendarEvents(timeMin?: string, timeMax?: string) {
    const accessToken = await this.getValidAccessToken();
    const calendarId = this.getCalendarId();
    const params = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin: timeMin ?? new Date().toISOString(),
    });

    if (timeMax) {
      params.set('timeMax', timeMax);
    }

    return this.googleRequest(
      `${this.calendarUrl}/${encodeURIComponent(calendarId)}/events?${params.toString()}`,
      accessToken,
    );
  }

  async getGoogleCalendarEvent(eventId: string) {
    const accessToken = await this.getValidAccessToken();
    const calendarId = this.getCalendarId();

    return this.googleRequest(
      `${this.calendarUrl}/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      accessToken,
    );
  }

  async createGoogleCalendarEvent(event: Record<string, unknown>) {
    const accessToken = await this.getValidAccessToken();
    const calendarId = this.getCalendarId();

    return this.googleRequest(
      `${this.calendarUrl}/${encodeURIComponent(calendarId)}/events`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify(event),
      },
    );
  }

  async updateGoogleCalendarEvent(
    eventId: string,
    event: Record<string, unknown>,
  ) {
    const accessToken = await this.getValidAccessToken();
    const calendarId = this.getCalendarId();

    return this.googleRequest(
      `${this.calendarUrl}/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      accessToken,
      {
        method: 'PATCH',
        body: JSON.stringify(event),
      },
    );
  }

  private async exchangeCodeForToken(code: string) {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: this.getRequiredEnv('GOOGLE_CLIENT_ID'),
        client_secret: this.getRequiredEnv('GOOGLE_CLIENT_SECRET'),
        redirect_uri: this.getRequiredEnv('GOOGLE_REDIRECT_URI'),
        grant_type: 'authorization_code',
      }),
    });

    return this.parseGoogleResponse<GoogleTokenResponse>(response);
  }

  private async refreshAccessToken() {
    const currentToken = await this.getStoredToken();

    if (!currentToken.refreshToken) {
      throw new UnauthorizedException('Google Calendar needs to be connected again.');
    }

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.getRequiredEnv('GOOGLE_CLIENT_ID'),
        client_secret: this.getRequiredEnv('GOOGLE_CLIENT_SECRET'),
        refresh_token: currentToken.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const tokenResponse = await this.parseGoogleResponse<GoogleTokenResponse>(
      response,
    );
    await this.saveTokenResponse(tokenResponse, currentToken.refreshToken);
  }

  private async getValidAccessToken() {
    const token = await this.getStoredToken();

    if (Date.now() > token.expiresAt - 60_000) {
      await this.refreshAccessToken();
      return this.getValidAccessToken();
    }

    return token.accessToken;
  }

  private async getStoredToken(): Promise<GoogleTokenState> {
    const token = await this.prisma.appointmentServiceToken.findUnique({
      where: {
        source: this.tokenSource,
      },
    });

    if (!token?.accessToken || !token.expiresAt) {
      throw new UnauthorizedException('Google Calendar is not connected.');
    }

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken ?? undefined,
      expiresAt: token.expiresAt.getTime(),
    };
  }

  private async saveTokenResponse(
    tokenResponse: GoogleTokenResponse,
    fallbackRefreshToken?: string,
  ) {
    const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

    return this.prisma.appointmentServiceToken.upsert({
      where: {
        source: this.tokenSource,
      },
      create: {
        source: this.tokenSource,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token ?? fallbackRefreshToken,
        expiresAt,
        scope: tokenResponse.scope,
        tokenType: tokenResponse.token_type,
      },
      update: {
        dateRetrieved: new Date(),
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token ?? fallbackRefreshToken,
        expiresAt,
        scope: tokenResponse.scope,
        tokenType: tokenResponse.token_type,
      },
    });
  }

  private async googleRequest(
    url: string,
    accessToken: string,
    init: RequestInit = {},
  ) {
    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });

    return this.parseGoogleResponse(response);
  }

  private async parseGoogleResponse<T = unknown>(response: Response) {
    const payload = (await response.json().catch(() => null)) as
      | (T & { error?: { message?: string }; error_description?: string })
      | null;

    if (!response.ok) {
      const message =
        payload?.error?.message ??
        payload?.error_description ??
        'Google Calendar request failed.';

      throw new InternalServerErrorException(message);
    }

    return payload as T;
  }

  private getCalendarId() {
    return process.env.GOOGLE_CALENDAR_ID ?? 'primary';
  }

  private getRequiredEnv(key: string) {
    const value = process.env[key];

    if (!value) {
      throw new InternalServerErrorException(`${key} is not configured.`);
    }

    return value;
  }
}
