import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CalendarEventFormValue } from '../../services/calendar-event.service';

export type CalendarEventFormInitialValue = Partial<CalendarEventFormValue>;

@Component({
  selector: 'app-calendar-event-form',
  imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './calendar-event-form.html',
  styleUrl: './calendar-event-form.scss',
})
export class CalendarEventForm implements OnChanges {
  @Input() public initialValue: CalendarEventFormInitialValue | null = null;

  private readonly formBuilder = new FormBuilder();

  public readonly form = this.formBuilder.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: [''],
    dateFrom: [null as Date | null, Validators.required],
    dateTo: [null as Date | null],
    comments: [''],
  });

  public ngOnChanges(): void {
    this.form.patchValue({
      name: this.initialValue?.name || '',
      lastname: this.initialValue?.lastname || '',
      phone: this.initialValue?.phone || '',
      email: this.initialValue?.email || '',
      address: this.initialValue?.address || '',
      dateFrom: this.parseDate(this.initialValue?.dateFrom),
      dateTo: this.parseDate(this.initialValue?.dateTo),
      comments: this.initialValue?.comments || '',
    });
  }

  public getValue(): CalendarEventFormValue | null {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    const value = this.form.getRawValue();

    if (!value.dateFrom) {
      return null;
    }

    return {
      name: value.name || '',
      lastname: value.lastname || '',
      phone: value.phone || '',
      email: value.email || '',
      address: value.address || '',
      dateFrom: this.formatDate(value.dateFrom),
      dateTo: value.dateTo ? this.formatDate(value.dateTo) : undefined,
      comments: value.comments || '',
    };
  }

  private parseDate(value: string | undefined): Date | null {
    if (!value) {
      return null;
    }

    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  private formatDate(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
