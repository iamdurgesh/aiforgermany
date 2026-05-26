import { Injectable, computed, inject } from '@angular/core';
import { articlesData } from '@content/articles.data';
import { topicsData } from '@content/topics.data';
import { LocaleService } from '@core/i18n/locale.service';
import { Article } from '@core/models/article.model';
import { Topic } from '@core/models/topic.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly localeService = inject(LocaleService);
  private readonly articles = computed(() => articlesData[this.localeService.currentLocale()]);
  private readonly topics = computed(() => topicsData[this.localeService.currentLocale()]);

  getArticles(): Article[] {
    return this.articles();
  }

  getFeaturedArticles(limit = 3): Article[] {
    return this.getArticles().slice(0, limit);
  }

  getArticleBySlug(slug: string): Article | undefined {
    return this.getArticles().find((article) => article.slug === slug);
  }

  getRelatedArticles(currentSlug: string, topicSlug: string, limit = 2): Article[] {
    return this.getArticles()
      .filter((article) => article.slug !== currentSlug && article.topicSlug === topicSlug)
      .slice(0, limit);
  }

  getArticlesByTopic(topicSlug: string, limit?: number): Article[] {
    const articles = this.getArticles().filter((article) => article.topicSlug === topicSlug);
    return typeof limit === 'number' ? articles.slice(0, limit) : articles;
  }

  getTopics(): Topic[] {
    return this.topics();
  }
}
