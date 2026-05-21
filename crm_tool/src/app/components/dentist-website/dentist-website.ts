import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageSwitcher } from '../../shared/language-switcher/language-switcher';

@Component({
    selector: 'app-dentist-website',
    imports: [MatButtonModule, RouterLink, TranslatePipe, LanguageSwitcher],
    templateUrl: './dentist-website.html',
    styleUrl: './dentist-website.scss',
})
export class DentistWebsite {}
