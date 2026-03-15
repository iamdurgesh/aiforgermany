import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((module) => module.HomePage),
    title: 'AI for Germany'
  },
  {
    path: 'articles',
    loadComponent: () => import('./pages/articles/articles.page').then((module) => module.ArticlesPage),
    title: 'Articles'
  },
  {
    path: 'articles/:slug',
    loadComponent: () =>
      import('./pages/article-detail/article-detail.page').then((module) => module.ArticleDetailPage),
    title: 'Article'
  },
  {
    path: 'topics',
    loadComponent: () => import('./pages/topics/topics.page').then((module) => module.TopicsPage),
    title: 'Topics'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then((module) => module.AboutPage),
    title: 'About'
  },
  {
    path: 'newsletter',
    loadComponent: () => import('./pages/newsletter/newsletter.page').then((module) => module.NewsletterPage),
    title: 'Newsletter'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.page').then((module) => module.NotFoundPage),
    title: 'Page not found'
  }
];
