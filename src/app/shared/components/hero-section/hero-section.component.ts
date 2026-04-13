import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomepageCarouselComponent } from '@shared/components/homepage-carousel/homepage-carousel.component';

@Component({
  selector: 'app-hero-section',
  imports: [HomepageCarouselComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent {}
