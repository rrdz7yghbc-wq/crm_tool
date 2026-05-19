import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface FaqAnswer {
    keywords: string[];
    answer: string;
}

@Injectable({
    providedIn: 'root',
})
export class FaqService {
    private readonly faqs: FaqAnswer[] = [
        {
            keywords: ['book', 'appointment', 'schedule', 'reservation'],
            answer: 'You can book an appointment by choosing an available date on the calendar and completing the event form.',
        },
        {
            keywords: ['reschedule', 'change', 'move', 'edit'],
            answer: 'To reschedule, click an existing event on the calendar, update the dates in the form, and save the changes.',
        },
        {
            keywords: ['cancel', 'delete', 'remove'],
            answer: 'Cancellation is not enabled yet. The next step would be adding a delete action to the event edit dialog.',
        },
        {
            keywords: ['information', 'details', 'need', 'required'],
            answer: 'The form asks for name, lastname, phone, email, address, date range, and comments.',
        },
        {
            keywords: ['hours', 'working', 'open', 'availability'],
            answer: 'Working hours are not configured yet. Availability rules can be added to the calendar service later.',
        },
    ];

    public ask(question: string): Observable<string> {
        const normalizedQuestion = question.toLowerCase();
        const faq = this.faqs.find((item) => item.keywords.some((keyword) => normalizedQuestion.includes(keyword)));

        return of(
            faq?.answer ||
                'I do not have an exact answer for that yet. Try asking about booking, rescheduling, cancellations, required information, or working hours.',
        );
    }
}
