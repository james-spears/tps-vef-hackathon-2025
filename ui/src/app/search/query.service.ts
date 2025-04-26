import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Result {
  text: string;
}

export interface Article {
  title: string;
  description: string;
}

export interface GeneratedResponse {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  private httpClient = inject(HttpClient);

  autocomplete(text: string): Observable<Result[]> {
    console.log('called auto');
    if (environment.production) {
      return this.httpClient.post<Result[]>(`/api/v1/autocomplete`, { text });
    } else {
      return of([
        { text: 'Query ' + Math.floor(Math.random() * 100) },

        { text: 'Query ' + Math.floor(Math.random() * 100) },

        { text: 'Query ' + Math.floor(Math.random() * 100) },

        { text: 'Query ' + Math.floor(Math.random() * 100) },

        { text: 'Query ' + Math.floor(Math.random() * 100) },
      ]).pipe(delay(1000));
    }
  }

  query(text: string): Observable<GeneratedResponse> {
    if (environment.production) {
      return this.httpClient.post<GeneratedResponse>(`/api/v1/query`, { text });
    } else {
      return of({
        text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.\n Ipsam ad saepe quia quod sequi voluptates, eveniet deserunt accusantium a atque! Numquam ratione aut, eos neque deleniti aperiam voluptas. Autem, saepe!
        Fugit aperiam debitis consequuntur quos ut rem, exercitationem non ipsum assumenda suscipit eius sed architecto veniam quidem quia labore laboriosam!\n Magni facilis eveniet impedit tenetur, quod eaque harum veritatis et.
        Explicabo molestiae nisi blanditiis velit quas ducimus error repellendus, voluptate delectus hic vero sed tenetur praesentium laboriosam neque quo modi unde animi qui impedit expedita, fuga doloremque nihil.\n Dolores, sit!
    `,
      }).pipe(delay(1000));
    }
  }
}
