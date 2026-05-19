import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface PatientVisit {
  date: string;
  reason: string;
  notes: string;
}

export interface Patient {
  id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  medicalHistory: string;
  visits: PatientVisit[];
}

export type PatientFormValue = Omit<Patient, 'id' | 'visits'> & {
  visits?: PatientVisit[];
};

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly apiUrl = 'http://localhost:3000/patients';
  private readonly requestOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  };

  private nextId = 1;
  private readonly patients: Patient[] = [];
  private http: HttpClient = inject(HttpClient);

  public getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl, this.requestOptions);
  }

  public getPatient(id: string): Observable<Patient | undefined> {
    const patient = this.patients.find((item) => item.id === id);

    return of(patient ? { ...patient, visits: [...patient.visits] } : undefined);
  }

  public insertPatient(patient: PatientFormValue): Observable<Patient> {
    const createdPatient: Patient = {
      ...patient,
      id: String(this.nextId++),
      visits: patient.visits || [],
    };

    this.patients.push(createdPatient);

    return of({ ...createdPatient, visits: [...createdPatient.visits] });
  }

  public updatePatient(id: string, patient: PatientFormValue): Observable<Patient> {
    const updatedPatient: Patient = {
      ...patient,
      id,
      visits: patient.visits || [],
    };
    const index = this.patients.findIndex((item) => item.id === id);

    if (index >= 0) {
      this.patients[index] = updatedPatient;
    }

    return of({ ...updatedPatient, visits: [...updatedPatient.visits] });
  }
}
