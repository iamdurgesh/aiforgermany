import { Injectable } from '@angular/core';
import { articlesData } from '@content/articles.data';
import { topicsData } from '@content/topics.data';
import { Article } from '@core/models/article.model';
import { Topic } from '@core/models/topic.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  getArticles(): Article[] {
    return [...articlesData];
  }

  getFeaturedArticles(limit = 3): Article[] {
    return this.getArticles().slice(0, limit);
  }

  getArticleBySlug(slug: string): Article | undefined {
    return articlesData.find((article) => article.slug === slug);
  }

  getRelatedArticles(currentSlug: string, topicSlug: string, limit = 2): Article[] {
    return articlesData
      .filter((article) => article.slug !== currentSlug && article.topicSlug === topicSlug)
      .slice(0, limit);
  }

  getArticlesByTopic(topicSlug: string, limit?: number): Article[] {
    const articles = articlesData.filter((article) => article.topicSlug === topicSlug);
    return typeof limit === 'number' ? articles.slice(0, limit) : articles;
  }

  getTopics(): Topic[] {
    return [...topicsData];
  }
}
