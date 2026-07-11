import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Antworten } from './schnellcheck.definition';
import { CheckResult } from './schnellcheck.scoring';

export interface SchnellcheckErgebnisAnfrage {
  readonly email: string;
  readonly einwilligung: true;
  readonly antworten: Antworten;
  readonly ampel: CheckResult['ampel'];
  readonly befunde: readonly string[];
}

/** Übermittelt das Ergebnis + E-Mail an das Backend (Double-Opt-in folgt per Mail). */
@Injectable({ providedIn: 'root' })
export class SchnellcheckApiService {
  private readonly http = inject(HttpClient);

  sendeErgebnis(anfrage: SchnellcheckErgebnisAnfrage): Observable<void> {
    return this.http.post<void>('/api/schnellcheck-result', anfrage);
  }
}
