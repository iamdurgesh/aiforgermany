import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Answers } from './schnellcheck.definition';
import { CheckResult } from './schnellcheck.scoring';

export interface SchnellcheckResultRequest {
  readonly email: string;
  readonly consent: true;
  readonly answers: Answers;
  readonly trafficLight: CheckResult['trafficLight'];
  readonly findings: readonly string[];
}

/** Submits the result + e-mail to the backend (double opt-in follows via mail). */
@Injectable({ providedIn: 'root' })
export class SchnellcheckApiService {
  private readonly http = inject(HttpClient);

  submitResult(request: SchnellcheckResultRequest): Observable<void> {
    return this.http.post<void>('/api/schnellcheck-result', request);
  }
}
