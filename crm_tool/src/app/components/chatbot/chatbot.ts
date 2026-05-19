import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ChatbotStore } from '../../store';

@Component({
    selector: 'app-chatbot',
    imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './chatbot.html',
    styleUrl: './chatbot.scss',
})
export class Chatbot {
    protected readonly chatbotStore = inject(ChatbotStore);
    protected readonly questionControl = new FormControl('', { nonNullable: true });

    protected submitQuestion(): void {
        const question = this.questionControl.value;

        this.chatbotStore.ask(question);
        this.questionControl.reset();
    }
}
