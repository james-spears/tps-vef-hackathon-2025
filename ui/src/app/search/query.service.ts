import { HttpClient } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';

export interface Result {
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  // private httpClient = inject(HttpClient);

  query(): Observable<Result[]> {
    // this.httpClient.get<Result[]>(`/api/v1/query?input=${input}`);

    return of([
      { title: 'Query ' + Math.floor(Math.random() * 100) },

      { title: 'Query ' + Math.floor(Math.random() * 100) },

      { title: 'Query ' + Math.floor(Math.random() * 100) },

      { title: 'Query ' + Math.floor(Math.random() * 100) },

      { title: 'Query ' + Math.floor(Math.random() * 100) },
    ]).pipe(delay(1000));
  }
}
