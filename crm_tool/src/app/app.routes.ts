import { Routes } from '@angular/router';

import { AdminCrm } from './components/admin-crm/admin-crm';
import { AdminLogin } from './components/admin-login/admin-login';
import { Calendar } from './components/calendar/calendar';
import { DentistWebsite } from './components/dentist-website/dentist-website';

export const routes: Routes = [
  {
    path: '',
    component: DentistWebsite,
  },
  {
    path: 'book',
    component: Calendar,
    data: {
      mode: 'public',
    },
  },
  {
    path: 'admin',
    component: AdminLogin,
  },
  {
    path: 'admin/calendar',
    component: Calendar,
    data: {
      mode: 'admin',
    },
  },
  {
    path: 'admin/crm',
    component: AdminCrm,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
