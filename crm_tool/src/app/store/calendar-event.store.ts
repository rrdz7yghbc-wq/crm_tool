import { inject } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import {
    CalendarEventFormValue,
    CalendarEventService,
    CreateCalendarEventRequest,
    UpdateCalendarEventRequest,
} from '../services/calendar-event.service';

interface CalendarEventState {
    events: EventInput[];
    isLoading: boolean;
    error: string | null;
}

const initialState: CalendarEventState = {
    events: [],
    isLoading: false,
    error: null,
};

let nextMockEventId = 4;

function buildCalendarEvent(event: CalendarEventFormValue, id: string): EventInput {
    return {
        id,
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
}

export const CalendarEventStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, calendarEventService = inject(CalendarEventService)) => ({
        loadEvents(): void {
            patchState(store, { isLoading: true, error: null });

            calendarEventService.getEvents().subscribe({
                next: (events) => patchState(store, { events, isLoading: false }),
                error: () =>
                    patchState(store, {
                        isLoading: false,
                        error: 'Unable to load calendar events.',
                    }),
            });
        },
        insertEvent(event: CreateCalendarEventRequest): void {
            const createdEvent = buildCalendarEvent(event, String(nextMockEventId++));

            patchState(store, (state) => ({
                events: [...state.events, createdEvent],
                error: null,
            }));
        },
        updateEvent(id: string, event: UpdateCalendarEventRequest): void {
            const updatedEvent = buildCalendarEvent(event, id);

            patchState(store, (state) => ({
                events: state.events.map((currentEvent) => (currentEvent.id === id ? updatedEvent : currentEvent)),
                error: null,
            }));
        },
    })),
);
