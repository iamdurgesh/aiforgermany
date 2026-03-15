import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '@core/models/article.model';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCardComponent {
  readonly article = input.required<Article>();
}
