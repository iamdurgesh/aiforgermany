/** Shared API DTO contract for the Angular client and Worker API. */

export type LeadSourceDto = 'schnellcheck' | 'newsletter';
export type TrafficLightDto = 'green' | 'yellow' | 'red';

export type AnswersDto = Readonly<Record<string, readonly string[]>>;

export interface NewsletterRequestDto {
  readonly email: string;
  readonly consent: true;
}

export interface SchnellcheckResultRequestDto extends NewsletterRequestDto {
  readonly answers: AnswersDto;
}

export interface CheckResultSummaryDto {
  readonly trafficLight: TrafficLightDto;
  readonly findings: readonly string[];
}

export interface ConfirmationRequiredResponseDto {
  readonly status: 'confirmation-required';
}

export interface ApiErrorResponseDto {
  readonly error: string;
}
