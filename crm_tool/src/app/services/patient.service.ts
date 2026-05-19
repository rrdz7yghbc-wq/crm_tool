import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { customerUrls } from '../url.constants';
import { Patient } from '../interfaces/patient.interfaces';

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    private readonly apiUrl = environment.apiUrl;
    private readonly requestOptions = {
        headers: new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }),
    };

    private http: HttpClient = inject(HttpClient);

    public getPatients(): Observable<Patient[]> {
        const patientUrl = customerUrls.getAllPatients;
        return this.http.get<Patient[]>(this.apiUrl + patientUrl, this.requestOptions);
    }

    public getPatientById(id: number): Observable<Patient | undefined> {
        const patientByIdUrl = `${customerUrls.getPatientById}/${id}`;
        return this.http.get<Patient>(this.apiUrl + patientByIdUrl, this.requestOptions);
    }

    public insertPatient(patient: Patient): Observable<Patient> {
        const patientUrl = `${customerUrls.insertPatient}`;
        return this.http.post<Patient>(this.apiUrl + patientUrl, patient, this.requestOptions);
    }

    public updatePatientById(id: number, patient: Patient): Observable<Patient> {
        const updatePatientByIdUrl = `${customerUrls.updatePatientById}/${id}`;
        return this.http.put<Patient>(this.apiUrl + updatePatientByIdUrl, patient, this.requestOptions);
    }
}
