import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'results',
    component: ResultsComponent,
  },
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'results',
    redirectTo: 'results',
    pathMatch: 'full',
  },
];
