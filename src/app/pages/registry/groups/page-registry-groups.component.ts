import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Action,
  DisplayColumn,
  PostActionOptions,
  TableAction,
} from '../../../components/pagination-table/content/pagination-table-content.component';
import { filter, map, Observable, switchMap } from 'rxjs';
import { PaginationTableComponent } from '../../../components/pagination-table/pagination-table.component';
import {
  Group,
  GroupsService,
  PaginationHttpOptions,
  rememberStudyPlaceId,
  WITH_STUDYPLACE_ID,
} from '@likdan/studyum-core';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Component({
  selector: 'page-registry-groups',
  standalone: true,
  imports: [
    PaginationTableComponent,
    MatButton,
  ],
  templateUrl: './page-registry-groups.component.html',
  styleUrl: './page-registry-groups.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageRegistryGroupsComponent {
  displayColumns: DisplayColumn[] = [
    {
      title: 'Name',
      property: 'name',
    },
  ];

  options = rememberStudyPlaceId(() => <PaginationHttpOptions>{
    url: 'api/types_registry/v1/groups',
    savePrevious: false,
    context: ctx => ctx.set(WITH_STUDYPLACE_ID, true),
  });

  actions: Action<Group>[] = [
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
    content: 'Add',
    action: this.add.bind(this),
  }];

  private dialog = inject(MatDialog);
  private service = inject(GroupsService);

  add(): Observable<void> {
    return fromPromise(import('./dialogs/item/page-registry-groups-item.component'))
      .pipe(map(c => c.PageRegistryGroupsItemComponent))
      .pipe(switchMap(c => this.dialog.open(c).afterClosed()))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.add(v)));
  }

  update(item: Group): Observable<void> {
    return fromPromise(import('./dialogs/item/page-registry-groups-item.component'))
      .pipe(map(c => c.PageRegistryGroupsItemComponent))
      .pipe(switchMap(c => this.dialog.open(c, { data: item }).afterClosed()))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.update(item.id, v)));
  }

  delete(item: Group): Observable<PostActionOptions> {
    return this.service.remove(item)
      .pipe(map(() => <PostActionOptions>{ removeRow: true }));
  }
}
