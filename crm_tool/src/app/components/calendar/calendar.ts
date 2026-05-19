import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import { CalendarEventFormValue } from '../../services/calendar-event.service';
import { CalendarEventStore } from '../../store/calendar-event.store';
import {
  CreateEventDialog,
  CreateEventDialogData,
  CreateEventDialogResult,
} from './event/create-event-dialog';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, MatButtonModule, RouterLink],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements OnInit {
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly calendarEventStore = inject(CalendarEventStore);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  protected readonly isAdmin = this.activatedRoute.snapshot.data['mode'] === 'admin';
  protected readonly calendarEvents = computed(() =>
    this.isAdmin ? this.calendarEventStore.events() : this.getPublicEvents(),
  );

  protected calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    height: 'auto',
    firstDay: 1,
    nowIndicator: true,
    selectable: true,
    dayMaxEvents: 3,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek',
    },
    dateClick: (date) => this.dateClicked(date),
    eventClick: (event) => this.eventClicked(event),
  };

  public ngOnInit(): void {
    this.calendarEventStore.loadEvents();
  }

  protected openCreateEventDialog(): void {
    this.openCreateEventDialogWithData();
  }

  protected dateClicked($event: DateClickArg): void {
    this.openCreateEventDialogWithData({
      initialValue: {
        dateFrom: $event.dateStr,
      },
    });
  }

  private openCreateEventDialogWithData(data?: CreateEventDialogData): void {
    this.dialog
      .open<CreateEventDialog, CreateEventDialogData | undefined, CreateEventDialogResult>(
        CreateEventDialog,
        {
          width: 'auto',
          maxWidth: 'calc(100vw - 32px)',
          data,
        },
      )
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }

        if (result.id) {
          this.calendarEventStore.updateEvent(result.id, result.event);
          return;
        }

        this.calendarEventStore.insertEvent(result.event);
      });
  }

  public eventClicked($event: EventClickArg): void {
    if (!this.isAdmin) {
      return;
    }

    this.openCreateEventDialogWithData({
      id: $event.event.id,
      initialValue: this.mapEventClickToFormValue($event),
    });
  }

  private mapEventClickToFormValue($event: EventClickArg): CalendarEventFormValue {
    const extendedProps = $event.event.extendedProps as Partial<CalendarEventFormValue>;

    return {
      name: extendedProps.name || '',
      lastname: extendedProps.lastname || '',
      phone: extendedProps.phone || '',
      email: extendedProps.email || '',
      address: extendedProps.address || '',
      dateFrom: this.formatDate($event.event.start) || '',
      dateTo: this.formatDate($event.event.end),
      comments: extendedProps.comments || '',
    };
  }

  private formatDate(value: Date | null): string | undefined {
    if (!value) {
      return undefined;
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private getPublicEvents(): EventInput[] {
    return this.calendarEventStore.events().map((event) => ({
      id: event.id,
      title: 'Taken',
      start: event.start || event.date,
      end: event.end,
      display: 'block',
      editable: false,
      classNames: ['calendar-event--taken'],
    }));
  }
}
