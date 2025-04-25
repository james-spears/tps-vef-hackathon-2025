
import { Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';

export interface Result {
  title: string;
}

export interface Article {
  title: string;
  description: string;
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

  getArticles(): Observable<Article[]> {
    // this.httpClient.get<Result[]>(`/api/v1/query?input=${input}`);

    return of([
      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 1' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 2' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 3' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 4' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 5' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 6' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 7' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 8' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 9' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 10' },

      { title: 'Article ' + Math.floor(Math.random() * 100), description: 'Desc 11' },
    ]).pipe(delay(1000));
  }
}
