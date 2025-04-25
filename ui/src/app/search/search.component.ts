import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, mergeMap, Observable, tap } from 'rxjs';
import { Article, QueryService, Result } from './query.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  loading = signal(false);

  results$: Observable<Result[]> = this.formGroup.valueChanges.pipe(
    debounceTime(300),
    tap(() => this.loading.set(true)),
    map((value) => value.search),
    mergeMap((result) => this.queryService.query()),
    tap(() => this.loading.set(false)),
    tap(() => this.menuOpen = true),
  );

  article$: Observable<Article[]> = this.formGroup.valueChanges.pipe(
    debounceTime(300),
    tap(() => this.loading.set(true)),
    map((value) => value.search),
    mergeMap((result) => this.queryService.getArticles()),
    tap(() => this.loading.set(false)),
  );

  onSubmit() {
    console.log(this.formGroup.value);
  }
}
