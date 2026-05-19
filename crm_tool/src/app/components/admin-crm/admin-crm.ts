import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { PatientStore } from '../../store';
import { PatientDialog } from './patient-dialog';
import { Patient } from '../../interfaces/patient.interfaces';

@Component({
    selector: 'app-admin-crm',
    imports: [MatButtonModule, MatPaginatorModule, MatSortModule, MatTableModule, RouterLink],
    templateUrl: './admin-crm.html',
    styleUrl: './admin-crm.scss',
})
export class AdminCrm implements OnInit {
    @ViewChild(MatPaginator) private set paginator(paginator: MatPaginator | undefined) {
        if (paginator) {
            this.dataSource.paginator = paginator;
        }
    }

    @ViewChild(MatSort) private set sort(sort: MatSort | undefined) {
        if (sort) {
            this.dataSource.sort = sort;
        }
    }

    protected readonly displayedColumns = ['name', 'lastname', 'phone', 'email'];
    protected readonly dataSource = new MatTableDataSource<Patient>([]);
    protected readonly patientStore = inject(PatientStore);

    private readonly dialog = inject(MatDialog);

    public constructor() {
        effect(() => {
            this.dataSource.data = this.patientStore.patients();
        });

        this.dataSource.sortingDataAccessor = (patient, property) => {
            if (property === 'name' || property === 'lastname') {
                return patient[property].toLowerCase();
            }

            return String(patient[property as keyof Patient] || '').toLowerCase();
        };
    }

    public ngOnInit(): void {
        this.patientStore.loadPatients();
    }

    protected openCreatePatientDialog(): void {
        this.dialog
            .open<PatientDialog, null, Patient>(PatientDialog, {
                width: 'auto',
                maxWidth: 'calc(100vw - 32px)',
                data: null,
            })
            .afterClosed()
            .subscribe((patient) => {
                if (patient) {
                    this.patientStore.insertPatient(patient);
                }
            });
    }

    protected openPatient(patient: Patient): void {
        this.patientStore.viewPatient(patient.id);

        this.dialog
            .open<PatientDialog, Patient, Patient>(PatientDialog, {
                width: 'auto',
                maxWidth: 'calc(100vw - 32px)',
                data: patient,
            })
            .afterClosed()
            .subscribe((updatedPatient) => {
                if (updatedPatient) {
                    this.patientStore.updatePatientById(patient.id, updatedPatient);
                }
            });
    }
}
