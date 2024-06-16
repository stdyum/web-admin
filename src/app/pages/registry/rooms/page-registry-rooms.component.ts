import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PaginationTableComponent } from '../../../components/pagination-table/pagination-table.component';
import {
  Action,
  DisplayColumn,
  PostActionOptions,
  TableAction,
} from '../../../components/pagination-table/content/pagination-table-content.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, Observable, switchMap } from 'rxjs';
import {
  ConfirmationDialog,
  PaginationHttpOptions,
  rememberStudyPlaceId,
  Room,
  RoomsService,
  WITH_STUDYPLACE_ID,
} from '@likdan/studyum-core';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Component({
  selector: 'app-page-registry-rooms',
  standalone: true,
  imports: [
    PaginationTableComponent,
  ],
  templateUrl: './page-registry-rooms.component.html',
  styleUrl: './page-registry-rooms.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageRegistryRoomsComponent {
  displayColumns: DisplayColumn[] = [
    {
      title: 'registry_rooms_column_name',
      property: 'name',
    },
  ];

  options = rememberStudyPlaceId(() => <PaginationHttpOptions>{
    url: 'api/types_registry/v1/rooms',
    savePrevious: false,
    context: ctx => ctx.set(WITH_STUDYPLACE_ID, true),
  });

  actions: Action<Room>[] = [
    {
      buttonType: 'icon',
      content: 'edit',
      action: this.update.bind(this),
    },
    {
      buttonType: 'icon',
      content: 'delete',
      action: this.delete.bind(this),
    },
  ];

  tableActions: TableAction[] = [{
    buttonType: 'text',
    content: 'registry_rooms_table_actions_add',
    action: this.add.bind(this),
  }];

  private dialog = inject(MatDialog);
  private service = inject(RoomsService);

  add(): Observable<PostActionOptions> {
    return fromPromise(import('./dialogs/item/page-registry-rooms-item.component'))
      .pipe(map(c => c.PageRegistryRoomsItemComponent))
      .pipe(switchMap(c => this.dialog.open(c).afterClosed()))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.add(v)))
      .pipe(map(v => <PostActionOptions>{ addRow: v }));
  }

  update(item: Room): Observable<PostActionOptions> {
    return fromPromise(import('./dialogs/item/page-registry-rooms-item.component'))
      .pipe(map(c => c.PageRegistryRoomsItemComponent))
      .pipe(switchMap(c => this.dialog.open(c, { data: item }).afterClosed()))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.update(item.id, v).pipe(map(() => v))))
      .pipe(map(v => <PostActionOptions>{ updateRow: { ...item, ...v } }));
  }

  delete(item: Room): Observable<PostActionOptions> {
    return this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'dialogs_delete_confirmation_title',
        body: 'dialogs_delete_confirmation_body',
        confirmButtonText: 'dialogs_delete_confirmation_confirm_button',
        confirmButtonColor: 'error',
        cancelButtonText: 'dialogs_delete_confirmation_cancel_button',
      },
    })
      .afterClosed()
      .pipe(filter(v => !!v))
      .pipe(switchMap(() => this.service.remove(item)))
      .pipe(map(() => <PostActionOptions>{ removeRow: true }));
  }
}
