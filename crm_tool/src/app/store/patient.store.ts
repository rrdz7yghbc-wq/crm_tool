import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Patient } from '../interfaces/patient.interfaces';
import { PatientService } from '../services/patient.service';

interface PatientState {
    patients: Patient[];
    selectedPatient: Patient | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: PatientState = {
    patients: [],
    selectedPatient: null,
    isLoading: false,
    error: null,
};

export const PatientStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, patientService = inject(PatientService)) => ({
        loadPatients(): void {
            patchState(store, { isLoading: true, error: null });

            patientService.getPatients().subscribe({
                next: (patients) => patchState(store, { patients, isLoading: false }),
                error: () =>
                    patchState(store, {
                        isLoading: false,
                        error: 'Unable to load patients.',
                    }),
            });
        },
        viewPatient(id: number): void {
            patchState(store, { isLoading: true, error: null });

            patientService.getPatientById(id).subscribe({
                next: (patient) =>
                    patchState(store, {
                        selectedPatient: patient || null,
                        isLoading: false,
                    }),
                error: () =>
                    patchState(store, {
                        isLoading: false,
                        error: 'Unable to load patient.',
                    }),
            });
        },
        insertPatient(patient: Patient): void {
            patientService.insertPatient(patient).subscribe({
                next: (createdPatient) =>
                    patchState(store, (state) => ({
                        patients: [...state.patients, createdPatient],
                        selectedPatient: createdPatient,
                        error: null,
                    })),
                error: () => patchState(store, { error: 'Unable to create patient.' }),
            });
        },
        updatePatientById(id: number, patient: Patient): void {
            patientService.updatePatientById(id, patient).subscribe({
                next: (updatedPatient) =>
                    patchState(store, (state) => ({
                        patients: state.patients.map((item) => (item.id === id ? updatedPatient : item)),
                        selectedPatient: updatedPatient,
                        error: null,
                    })),
                error: () => patchState(store, { error: 'Unable to update patient.' }),
            });
        },
    })),
);
