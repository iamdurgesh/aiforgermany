import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type {
  ConfirmationRequiredResponseDto,
  SchnellcheckResultRequestDto,
} from '../../../api/dto';

/** Submits the result + e-mail to the backend (double opt-in follows via mail). */
@Injectable({ providedIn: 'root' })
export class SchnellcheckApiService {
  private readonly http = inject(HttpClient);

  submitResult(request: SchnellcheckResultRequestDto): Observable<ConfirmationRequiredResponseDto> {
    return this.http.post<ConfirmationRequiredResponseDto>('/api/schnellcheck-result', request);
  }
}
