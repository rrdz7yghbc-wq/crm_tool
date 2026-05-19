import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Chatbot } from './components/chatbot/chatbot';

@Component({
  selector: 'app-root',
  imports: [Chatbot, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('crm_tool');
}
