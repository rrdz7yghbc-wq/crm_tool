import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { Observable, of } from 'rxjs';

export interface CalendarEventFormValue {
  name: string;
  lastname: string;
  phone: string;
  email: string;
  address: string;
  dateFrom: string;
  dateTo?: string;
  comments: string;
}

export type CreateCalendarEventRequest = CalendarEventFormValue;
export type UpdateCalendarEventRequest = CalendarEventFormValue;

@Injectable({
  providedIn: 'root',
})
export class CalendarEventService {
  private nextId = 4;

  private readonly events: EventInput[] = [
    {
      id: '1',
      title: 'Maria Papadopoulos',
      start: new Date().toISOString().slice(0, 10),
      extendedProps: {
        name: 'Maria',
        lastname: 'Papadopoulos',
        phone: '+30 210 555 0101',
        email: 'maria@example.com',
        address: '12 Ermou Street, Athens',
        comments: 'Customer follow-up',
      },
    },
    {
      id: '2',
      title: 'Nikos Georgiou',
      start: '2026-05-20',
      extendedProps: {
        name: 'Nikos',
        lastname: 'Georgiou',
        phone: '+30 210 555 0102',
        email: 'nikos@example.com',
        address: '45 Stadiou Street, Athens',
        comments: 'Pipeline review',
      },
    },
    {
      id: '3',
      title: 'Eleni Ioannou',
      start: '2026-05-22',
      extendedProps: {
        name: 'Eleni',
        lastname: 'Ioannou',
        phone: '+30 210 555 0103',
        email: 'eleni@example.com',
        address: '8 Tsimiski Street, Thessaloniki',
        comments: 'Proposal deadline',
      },
    },
  ];

  public getEvents(): Observable<EventInput[]> {
    return of([...this.events]);
  }

  public insertEvent(event: CreateCalendarEventRequest): Observable<EventInput> {
    const createdEvent: EventInput = {
      id: String(this.nextId++),
      title: `${event.name} ${event.lastname}`,
      start: event.dateFrom,
      end: event.dateTo || undefined,
      extendedProps: {
        name: event.name,
        lastname: event.lastname,
        phone: event.phone,
        email: event.email,
        address: event.address,
        comments: event.comments,
      },
    };

    this.events.push(createdEvent);

    return of(createdEvent);
  }
}
