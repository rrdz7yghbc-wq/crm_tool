import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dentist-website',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './dentist-website.html',
  styleUrl: './dentist-website.scss',
})
export class DentistWebsite {}
