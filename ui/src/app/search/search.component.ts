import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { GeneratedResponse, QueryService, Result } from './query.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [AsyncPipe, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  constructor() {}
  formBuilder = inject(FormBuilder);
  formControl = new FormControl('');

  formGroup = this.formBuilder.group({
    search: [''],
  });

  queryService = inject(QueryService);
  menuOpen = false;
  loading = false;
  submitted = false;
  error = false;
  cachedResults: Result[] = [];

  results$: Observable<Result[]> = this.formGroup.valueChanges.pipe(
    tap(() => {
      console.log('change');
      this.loading = true;
      this.submitted = false;
      this.error = false;
      this.response$ = undefined;
    }),
    debounceTime(300),
    map((value) => value.search),
    switchMap((text) =>
      this.queryService.autocomplete(text ?? '').pipe(catchError(() => {
        if (this.cachedResults.length > 0) {
          return of(this.cachedResults);
        } else {
          this.error = true;
          return of([]);
        }
      })),
    ),
    tap((results) => {
      this.cachedResults = results;
      this.menuOpen = true;
      this.loading = false;
    }),
  );

  response$: Observable<string[]> | undefined;

  onSubmit() {
    console.log(this.formGroup.value);
    this.submitted = true;
    this.loading = true;
    if (this.formGroup.value.search) {
      this.response$ = this.queryService
        .query(this.formGroup.value.search)
        .pipe(
          map((response) => response.text.split('\n')),
          tap(() => {
            this.menuOpen = true;
            this.loading = false;
          }),
        );
    }
  }
}
