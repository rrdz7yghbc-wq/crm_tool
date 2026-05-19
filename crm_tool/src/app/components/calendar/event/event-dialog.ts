import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

export interface CalendarEventDialogData {
    id: string;
    title: string;
    start: Date | null;
    end: Date | null;
}

@Component({
    selector: 'app-event-dialog',
    imports: [DatePipe, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
    templateUrl: './event-dialog.html',
    styleUrl: './event-dialog.scss',
})
export class EventDialog {
    protected readonly data = inject<CalendarEventDialogData>(MAT_DIALOG_DATA);
}
