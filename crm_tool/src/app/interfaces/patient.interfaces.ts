export interface PatientVisit {
    date: string;
    reason: string;
    notes: string;
}

export interface Patient {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    address: string;
    dateOfBirth: string;
    medicalHistory: string;
    visits?: PatientVisit[];
}

export type PatientFormValue = Omit<Patient, 'id' | 'visits'> & {
    visits?: PatientVisit[];
};
