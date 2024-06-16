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
  ConfirmationDialog,
  PaginationHttpOptions,
  rememberStudyPlaceId,
  StudentGroup,
  StudentsGroupsService,
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
  templateUrl: './page-registry-students-groups.component.html',
  styleUrl: './page-registry-students-groups.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageRegistryStudentsGroupsComponent {
  displayColumns: DisplayColumn[] = [
    {
      title: 'registry_students_groups_column_student_name',
      property: 'studentName',
    },
    {
      title: 'registry_students_groups_column_group_name',
      property: 'groupName',
    },
  ];

  options = rememberStudyPlaceId(() => <PaginationHttpOptions>{
    url: 'api/types_registry/v1/students_groups',
    savePrevious: false,
    context: ctx => ctx.set(WITH_STUDYPLACE_ID, true),
  });

  actions: Action<StudentGroup>[] = [
    {
      buttonType: 'icon',
      content: 'delete',
      action: this.delete.bind(this),
    },
  ];

  tableActions: TableAction[] = [{
    buttonType: 'text',
    content: 'registry_students_groups_table_actions_add',
    action: this.add.bind(this),
  }];

  private dialog = inject(MatDialog);
  private service = inject(StudentsGroupsService);

  getItemId(item: StudentGroup): string {
    return item.studentId + item.groupId;
  }

  add(): Observable<PostActionOptions> {
    return fromPromise(import('./dialogs/item/page-registry-students-groups-item.component'))
      .pipe(map(c => c.PageRegistryStudentsGroupsItemComponent))
      .pipe(switchMap(c => this.dialog.open(c).afterClosed()))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.add(v).pipe(map(() => v))))
      .pipe(map(() => <PostActionOptions>{ addRow: true }));
  }

  delete(item: StudentGroup): Observable<PostActionOptions> {
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
