import { ChangeDetectionStrategy, Component, effect, inject, Injector, input, signal } from '@angular/core';
import { Pagination, PaginationHttpOptions, PaginationHttpProcessor } from '@likdan/studyum-core';
import { LoadedStateDirective, LoadingStateDirective, State, StateMapperComponent } from '@likdan/state-mapper';
import { PaginationTableStateComponent } from './state/pagination-table-state.component';
import {
  Action,
  DisplayColumn,
  PaginationTableContentComponent,
  TableAction,
  TableOptions,
} from './content/pagination-table-content.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, merge, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'pagination-table',
  standalone: true,
  imports: [
    StateMapperComponent,
    LoadingStateDirective,
    LoadedStateDirective,
    PaginationTableStateComponent,
    PaginationTableContentComponent,
  ],
  templateUrl: './pagination-table.component.html',
  styleUrl: './pagination-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationTableComponent<T> {
  options = input<PaginationHttpOptions | null>();
  displayColumns = input<DisplayColumn[]>([]);
  actions = input<Action<T>[]>([]);
  tableActions = input<TableAction[]>([]);
  getItemId = input<(item: T) => any>(i => (i as any).id);

  processor = signal<PaginationHttpProcessor<T> | null>(null);

  data$: Observable<State<Pagination<T>>> = toObservable(this.processor)
    .pipe(switchMap(processor => !processor ?
      of(<State<Pagination<T>>>{ state: 'loading' }) :
      this.mergeProcessorToState(processor),
    ))
    .pipe(filter(p => !!p));

  private injector = inject(Injector);

  constructor() {
    effect(() => {
      const options = this.options();
      if (!options) return;
      if (this.processor()?.options === options) return;

      const processor = new PaginationHttpProcessor<T>(this.injector, options);
      this.processor.set(processor);
    }, {
      allowSignalWrites: true,
    });
  }

  tableOptions(item: Pagination<T> | null): TableOptions {
    return {
      hasNext: !!item?.next,
      hasPrevious: !!item?.previous,
    };
  }

  nextPage(): void {
    this.processor()?.next();
  }

  previousPage(): void {
    this.processor()?.previous();
  }

  private mergeProcessorToState(processor: PaginationHttpProcessor<T>): Observable<State<Pagination<T>>> {
    return merge(
      toObservable(processor!.pagination, { injector: this.injector })
        .pipe(map(p => <State<Pagination<T>>>{ state: 'loaded', data: p })),
      toObservable(processor!.loading, { injector: this.injector })
        .pipe(filter(p => !!p))
        .pipe(map(() => <State<Pagination<T>>>{ state: 'loading' })),
    );
  }
}
