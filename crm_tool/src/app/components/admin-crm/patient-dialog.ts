import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Patient, PatientFormValue } from '../../services/patient.service';

@Component({
  selector: 'app-patient-dialog',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './patient-dialog.html',
  styleUrl: './patient-dialog.scss',
})
export class PatientDialog {
  protected readonly patient = inject<Patient | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly dialogRef = inject(MatDialogRef<PatientDialog>);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly patientForm = this.formBuilder.nonNullable.group({
    name: [this.patient?.name || '', Validators.required],
    lastname: [this.patient?.lastname || '', Validators.required],
    phone: [this.patient?.phone || '', Validators.required],
    email: [this.patient?.email || '', [Validators.required, Validators.email]],
    address: [this.patient?.address || ''],
    dateOfBirth: [this.patient?.dateOfBirth || ''],
    medicalHistory: [this.patient?.medicalHistory || ''],
  });

  protected save(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.patientForm.getRawValue(),
      visits: this.patient?.visits || [],
    } satisfies PatientFormValue);
  }
}
