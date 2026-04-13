import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizedDatePipe } from '@core/i18n/localized-date.pipe';
import { LocalizedRouterService } from '@core/i18n/localized-router.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { Article } from '@core/models/article.model';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink, LocalizedDatePipe, TranslatePipe],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCardComponent {
  protected readonly localizedRouter = inject(LocalizedRouterService);
  protected readonly translate = inject(TranslateService);
  readonly article = input.required<Article>();
}
