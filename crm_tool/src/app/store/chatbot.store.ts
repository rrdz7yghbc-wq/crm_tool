import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { FaqService } from '../services/faq.service';

export interface ChatbotMessage {
    id: number;
    author: 'user' | 'bot';
    text: string;
}

interface ChatbotState {
    messages: ChatbotMessage[];
    isOpen: boolean;
    isLoading: boolean;
}

const initialState: ChatbotState = {
    messages: [
        {
            id: 1,
            author: 'bot',
            text: 'Hi. Ask me about booking, rescheduling, cancellations, required information, or working hours.',
        },
    ],
    isOpen: false,
    isLoading: false,
};

let nextMessageId = 2;

export const ChatbotStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, faqService = inject(FaqService)) => ({
        open(): void {
            patchState(store, { isOpen: true });
        },
        close(): void {
            patchState(store, { isOpen: false });
        },
        toggle(): void {
            patchState(store, (state) => ({ isOpen: !state.isOpen }));
        },
        ask(question: string): void {
            const trimmedQuestion = question.trim();

            if (!trimmedQuestion) {
                return;
            }

            const userMessage: ChatbotMessage = {
                id: nextMessageId++,
                author: 'user',
                text: trimmedQuestion,
            };

            patchState(store, (state) => ({
                messages: [...state.messages, userMessage],
                isLoading: true,
            }));

            faqService.ask(trimmedQuestion).subscribe((answer) => {
                const botMessage: ChatbotMessage = {
                    id: nextMessageId++,
                    author: 'bot',
                    text: answer,
                };

                patchState(store, (state) => ({
                    messages: [...state.messages, botMessage],
                    isLoading: false,
                }));
            });
        },
    })),
);
