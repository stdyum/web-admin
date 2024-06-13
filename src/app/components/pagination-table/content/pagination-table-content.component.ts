import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { Pagination, TranslationPipe } from '@likdan/studyum-core';
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
import { filter, isObservable, map, Observable, of, take } from 'rxjs';

export interface DisplayColumn {
  property: string;
  title: string;
}

export interface PostActionOptions {
  removeRow?: boolean;
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
  ],
  templateUrl: './pagination-table-content.component.html',
  styleUrl: './pagination-table-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationTableContentComponent<T> {
  pagination = input<Pagination<T> | null>(null);
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

  previous = output<void>();
  next = output<void>();

  constructor() {
    effect(() => {
      this.items.set(this.pagination()?.items ?? []);
    }, {
      allowSignalWrites: true,
    });
  }

  handleAction(action: Action<T>, item: T): void {
    const result = action.action(item);
    this.subscribeToActionResult(result, o => this.handlePostActionOptions(action, item, o));
  }

  handleTableAction(action: TableAction): void {
    const result = action.action();
    this.subscribeToActionResult(result, () => null);
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

  private handlePostActionOptions(_: Action<T>, item: T, options: PostActionOptions): void {
    if (options.removeRow) this.removeItem(item);
  }

  private removeItem(item: T): void {
    const removalItemId = this.getItemId()(item);
    const items = this.items().filter(i => this.getItemId()(i) !== removalItemId);
    this.items.set(items);
  }
}
