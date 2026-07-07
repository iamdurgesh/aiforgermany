import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'AI for Germany — KI-Einsatz und KI-Regulierung im Mittelstand',
  },
  {
    path: 'artikel',
    loadComponent: () =>
      import('./features/artikel/artikel-index.component').then((m) => m.ArtikelIndexComponent),
    title: 'Artikel — AI for Germany',
  },
  {
    path: 'artikel/:slug',
    loadComponent: () =>
      import('./features/artikel/artikel-detail.component').then((m) => m.ArtikelDetailComponent),
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
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Seite nicht gefunden — AI for Germany',
  },
];
