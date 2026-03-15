import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface HeroAction {
  label: string;
  route: string;
  variant: 'primary' | 'secondary';
}

export interface HeroStat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent {
  readonly eyebrow = input('Editorial platform');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly actions = input<readonly HeroAction[]>([]);
  readonly stats = input<readonly HeroStat[]>([]);
}
