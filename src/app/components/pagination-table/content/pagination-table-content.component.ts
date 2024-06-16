import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  output,
  Signal,
  signal,
} from '@angular/core';
import { Pagination, PaginationHttpOptions, PaginationHttpProcessor, TranslationPipe } from '@likdan/studyum-core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, filter, isObservable, map, Observable, of, take } from 'rxjs';
import { TextInputComponent } from '@likdan/form-builder-material/controls/components/inputs/text-input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface DisplayColumn {
  property: string;
  title: string;
  transform?: (value: any) => Signal<string>;
}

export interface PostActionOptions {
  removeRow?: boolean;
  updateRow?: any;
  addRow?: any;
}

export interface Action<T> {
  buttonType: 'icon' | 'text',
  content: string;
  action: (item: T) => void | PostActionOptions | Observable<void | PostActionOptions>;
}

export interface TableAction {
  buttonType: 'icon' | 'text',
  content: string;
  action: () => void | PostActionOptions | Observable<void | PostActionOptions>
}

export interface TableOptions {
  hasNext?: boolean;
  hasPrevious?: boolean;
}

@Component({
  selector: 'pagination-table-content',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatRow,
    MatRowDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIconButton,
    MatIcon,
    MatButton,
    TranslationPipe,
    TextInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './pagination-table-content.component.html',
  styleUrl: './pagination-table-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationTableContentComponent<T> {
  initialPagination = input<Pagination<T> | null>(null, { alias: 'pagination' });
  paginationOptions = input<PaginationHttpOptions>();
  options = input<TableOptions | null>(null);
  displayColumns = input<DisplayColumn[]>([]);
  actions = input<Action<T>[]>([]);
  tableActions = input<TableAction[]>([]);
  getItemId = input<(item: T) => any>(i => (i as any).id);
  displayColumnsProps = computed(() => {
    const columns = this.displayColumns();
    const props = columns.map(c => c.property);
    return !!this.actions().length ? [...props, 'actions'] : props;
  });
  items = signal<T[]>([]);
  pagination = signal<Pagination<T> | null>(null);

  previous = output<void>();
  next = output<void>();
  searchControl = new FormControl('');

  private injector = inject(Injector);

  constructor() {
    effect(() => {
      this.items.set(this.pagination()?.items ?? []);
    }, {
      allowSignalWrites: true,
    });

    effect(() => {
      this.pagination.set(this.initialPagination());
    }, {
      allowSignalWrites: true,
    });

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed())
      .pipe(debounceTime(500))
      .pipe(map(v =>  {
        const options = this.paginationOptions();
        if (!options) return;

        options.query = {
          search: v,
        };

        this.loadPagination(options)
      }))
      .subscribe();
  }

  handleAction(action: Action<T>, item: T): void {
    const result = action.action(item);
    this.subscribeToActionResult(result, o => this.handlePostActionOptions(action, item, o));
  }

  handleTableAction(action: TableAction): void {
    const result = action.action();
    this.subscribeToActionResult(result, o => this.handlePostActionOptions(action, null, o));
  }

  private loadPagination(options: PaginationHttpOptions): void {
    const processor = new PaginationHttpProcessor<T>(this.injector, options);
    effect(() => this.pagination.set(processor.pagination()), {
      allowSignalWrites: true,
      injector: this.injector
    });
  }

  private subscribeToActionResult(result: void | PostActionOptions | Observable<void | PostActionOptions>, next: (o: PostActionOptions) => void) {
    this.toObservable(result)
      .pipe(take(1))
      .pipe(filter(v => !!v))
      .pipe(map(v => v as PostActionOptions))
      .subscribe(o => next(o));
  }

  private toObservable<R>(item: R | Observable<R>): Observable<R> {
    return isObservable(item) ? item : of(item);
  }

  private handlePostActionOptions(_: Action<T>, item: T | null, options: PostActionOptions): void {
    if (options.removeRow && !!item) this.removeItem(item);
    if (options.updateRow) this.updateRow(options.updateRow);
    if (options.addRow) this.addRow(options.addRow);
  }

  private removeItem(item: T): void {
    const removalItemId = this.getItemId()(item);
    const items = this.items().filter(i => this.getItemId()(i) !== removalItemId);
    this.items.set(items);
  }

  private updateRow(item: T): void {
    this.items.update(items => {
      const itemId = this.getItemId()(item);
      const i = items.findIndex(v => this.getItemId()(v) === itemId);
      items[i] = item;
      return [...items];
    });
  }

  private addRow(item: T): void {
    this.items.update(i => [item, ...i]);
  }
}
