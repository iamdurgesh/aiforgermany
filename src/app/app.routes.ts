import { Routes } from '@angular/router';
import { localeGuard, rootLocaleRedirectGuard } from '@core/i18n/locale.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canMatch: [rootLocaleRedirectGuard],
    children: []
  },
  {
    path: ':locale',
    canActivate: [localeGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.page').then((module) => module.HomePage)
      },
      {
        path: 'articles',
        loadComponent: () => import('./pages/articles/articles.page').then((module) => module.ArticlesPage)
      },
      {
        path: 'articles/:slug',
        loadComponent: () =>
          import('./pages/article-detail/article-detail.page').then((module) => module.ArticleDetailPage)
      },
      {
        path: 'topics',
        loadComponent: () => import('./pages/topics/topics.page').then((module) => module.TopicsPage)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.page').then((module) => module.AboutPage)
      },
      {
        path: 'newsletter',
        loadComponent: () => import('./pages/newsletter/newsletter.page').then((module) => module.NewsletterPage)
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.page').then((module) => module.NotFoundPage)
      }
    ]
  }
];
