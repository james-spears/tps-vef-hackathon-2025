import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  delay,
  filter,
  map,
  mergeMap,
  Observable,
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
  private changeDeterctorRef = inject(ChangeDetectorRef);

  results$: Observable<Result[]> = this.formGroup.valueChanges.pipe(
    tap(() => {
      console.log('change');
      this.loading = true;
      this.submitted = false;
      this.response$ = undefined;
    }),
    debounceTime(300),
    map((value) => value.search),
    switchMap((text) => this.queryService.autocomplete(text ?? '')),
    tap(() => {
      this.menuOpen = true;
      this.loading = false;
    }),
  );

  response$: Observable<GeneratedResponse> | undefined;

  onSubmit() {
    console.log(this.formGroup.value);
    this.submitted = true;
    this.loading = true;
    if (this.formGroup.value.search) {
      this.response$ = this.queryService
        .query(this.formGroup.value.search)
        .pipe(
          tap(() => {
            this.menuOpen = true;
            this.loading = false;
          }),
        );
    }
  }
}
