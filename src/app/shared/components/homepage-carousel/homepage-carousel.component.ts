import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizedRouterService } from '@core/i18n/localized-router.service';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { ContentService } from '@core/services/content.service';

interface CarouselSlide {
  readonly title: string;
  readonly subtitle: string;
  readonly image: string;
  readonly alt: string;
}

@Component({
  selector: 'app-homepage-carousel',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './homepage-carousel.component.html',
  styleUrl: './homepage-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageCarouselComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);
  private readonly contentService = inject(ContentService);
  private readonly localeService = inject(LocaleService);

  protected readonly localizedRouter = inject(LocalizedRouterService);
  protected readonly currentIndex = signal(0);
  protected readonly slides = computed<readonly CarouselSlide[]>(() => [
    {
      title: this.translate.t('pages.home.carousel.slides.frontier.title'),
      subtitle: this.translate.t('pages.home.carousel.slides.frontier.subtitle'),
      alt: this.translate.t('pages.home.carousel.slides.frontier.alt'),
      image: '/assets/carousal_6.png',
    },
    {
      title: this.translate.t('pages.home.carousel.slides.ecosystem.title'),
      subtitle: this.translate.t('pages.home.carousel.slides.ecosystem.subtitle'),
      alt: this.translate.t('pages.home.carousel.slides.ecosystem.alt'),
      image: '/assets/carousal_5.png',
    },
    {
      title: this.translate.t('pages.home.carousel.slides.industry.title'),
      subtitle: this.translate.t('pages.home.carousel.slides.industry.subtitle'),
      alt: this.translate.t('pages.home.carousel.slides.industry.alt'),
      image: '/assets/carousal_1.avif',
    },
    {
      title: this.translate.t('pages.home.carousel.slides.research.title'),
      subtitle: this.translate.t('pages.home.carousel.slides.research.subtitle'),
      alt: this.translate.t('pages.home.carousel.slides.research.alt'),
      image: '/assets/carousal_2.avif',
    },
    {
      title: this.translate.t('pages.home.carousel.slides.mobility.title'),
      subtitle: this.translate.t('pages.home.carousel.slides.mobility.subtitle'),
      alt: this.translate.t('pages.home.carousel.slides.mobility.alt'),
      image: '/assets/carousal_3.avif',
    },
    {
      title: this.translate.t('pages.home.carousel.slides.governance.title'),
      subtitle: this.translate.t('pages.home.carousel.slides.governance.subtitle'),
      alt: this.translate.t('pages.home.carousel.slides.governance.alt'),
      image: '/assets/carousal_4.avif',
    },
  ]);
  protected readonly activeSlide = computed(() => this.slides()[this.currentIndex()]);
  protected readonly articleCount = computed(() => this.contentService.getArticles().length);
  protected readonly topicCount = computed(() => this.contentService.getTopics().length);
  protected readonly localeCount = this.localeService.availableLocales.length;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const timer = setInterval(() => {
        this.currentIndex.update((index) => (index + 1) % this.slides().length);
      }, 5000);

      this.destroyRef.onDestroy(() => clearInterval(timer));
    }
  }

  protected setCurrentIndex(index: number): void {
    this.currentIndex.set(index);
  }
}
