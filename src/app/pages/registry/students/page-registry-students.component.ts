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
  PaginationHttpOptions,
  rememberStudyPlaceId,
  Student,
  StudentsService,
  WITH_STUDYPLACE_ID,
} from '@likdan/studyum-core';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Component({
  selector: 'app-page-registry-students',
  standalone: true,
  imports: [
    PaginationTableComponent,
  ],
  templateUrl: './page-registry-students.component.html',
  styleUrl: './page-registry-students.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageRegistryStudentsComponent {
  displayColumns: DisplayColumn[] = [
    {
      title: 'Name',
      property: 'name',
    },
  ];

  options = rememberStudyPlaceId(() => <PaginationHttpOptions>{
    url: 'api/types_registry/v1/students',
    savePrevious: false,
    context: ctx => ctx.set(WITH_STUDYPLACE_ID, true),
  });

  actions: Action<Student>[] = [
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
  private service = inject(StudentsService);

  add(): Observable<void> {
    return fromPromise(import('./dialogs/item/page-registry-students-item.component'))
      .pipe(map(c => c.PageRegistryStudentsItemComponent))
      .pipe(switchMap(c => this.dialog.open(c).afterClosed()))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.add(v)));
  }

  update(item: Student): Observable<void> {
    return fromPromise(import('./dialogs/item/page-registry-students-item.component'))
      .pipe(map(c => c.PageRegistryStudentsItemComponent))
      .pipe(switchMap(c => this.dialog.open(c, { data: item }).afterClosed()))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.update(item.id, v)));
  }

  delete(item: Student): Observable<PostActionOptions> {
    return this.service.remove(item)
      .pipe(map(() => <PostActionOptions>{ removeRow: true }));
  }
}
