import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

import { CalendarEventForm, CalendarEventFormInitialValue } from '../../../shared/calendar-event-form/calendar-event-form';
import { CalendarEventFormValue } from '../../../services/calendar-event.service';

export interface CreateEventDialogData {
    id?: string;
    initialValue?: CalendarEventFormInitialValue;
}

export interface CreateEventDialogResult {
    id?: string;
    event: CalendarEventFormValue;
}

@Component({
    selector: 'app-create-event-dialog',
    imports: [CalendarEventForm, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
    templateUrl: './create-event-dialog.html',
    styleUrl: './create-event-dialog.scss',
    providers: [provideNativeDateAdapter()],
})
export class CreateEventDialog {
    protected readonly data = inject<CreateEventDialogData | null>(MAT_DIALOG_DATA, {
        optional: true,
    });

    private readonly dialogRef = inject(MatDialogRef<CreateEventDialog>);

    protected saveEvent(form: CalendarEventForm): void {
        const event = form.getValue();

        if (!event) {
            return;
        }

        this.dialogRef.close({
            id: this.data?.id,
            event,
        } satisfies CreateEventDialogResult);
    }
}
