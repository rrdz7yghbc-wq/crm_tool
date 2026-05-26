import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('google/connect')
  connectToGoogleCalendar() {
    return this.appointmentsService.connectToGoogleCalendar();
  }

  @Get('google/status')
  getGoogleCalendarConnectionStatus() {
    return this.appointmentsService.getGoogleCalendarConnectionStatus();
  }

  @Get('google/callback')
  @Redirect()
  async handleGoogleCallback(@Query('code') code?: string) {
    await this.appointmentsService.handleGoogleCallback(code);

    return {
      url: `${process.env.FRONTEND_URL ?? 'http://localhost:4200'}?section=appointments&googleCalendar=connected`,
    };
  }

  @Get('google/events')
  getGoogleCalendarEvents(
    @Query('timeMin') timeMin?: string,
    @Query('timeMax') timeMax?: string,
  ) {
    return this.appointmentsService.getGoogleCalendarEvents(timeMin, timeMax);
  }

  @Get('google/events/:eventId')
  getGoogleCalendarEvent(@Param('eventId') eventId: string) {
    return this.appointmentsService.getGoogleCalendarEvent(eventId);
  }

  @Post('google/events')
  createGoogleCalendarEvent(@Body() event: Record<string, unknown>) {
    return this.appointmentsService.createGoogleCalendarEvent(event);
  }

  @Patch('google/events/:eventId')
  updateGoogleCalendarEvent(
    @Param('eventId') eventId: string,
    @Body() event: Record<string, unknown>,
  ) {
    return this.appointmentsService.updateGoogleCalendarEvent(eventId, event);
  }
}
