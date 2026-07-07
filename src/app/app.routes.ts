import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'AI for Germany — KI-Einsatz und KI-Regulierung im Mittelstand',
  },
  {
    path: 'ueber',
    loadComponent: () => import('./features/ueber/ueber.component').then((m) => m.UeberComponent),
    title: 'Über dieses Portal — AI for Germany',
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./features/legal/impressum.component').then((m) => m.ImpressumComponent),
    title: 'Impressum — AI for Germany',
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('./features/legal/datenschutz.component').then((m) => m.DatenschutzComponent),
    title: 'Datenschutzerklärung — AI for Germany',
  },
];
