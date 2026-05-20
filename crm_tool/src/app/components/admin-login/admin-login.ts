import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../../shared/language-switcher/language-switcher';

@Component({
    selector: 'app-admin-login',
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterLink,
        TranslatePipe,
        LanguageSwitcher,
    ],
    templateUrl: './admin-login.html',
    styleUrl: './admin-login.scss',
})
export class AdminLogin {
    protected readonly email = new FormControl('owner@asterdental.test', { nonNullable: true });
    protected readonly password = new FormControl('demo-password', { nonNullable: true });

    public constructor(private readonly router: Router) {}

    public login(): void {
        this.router.navigate(['/admin/calendar']);
    }
}
