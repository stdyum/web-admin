import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Action,
  DisplayColumn,
  PostActionOptions,
} from '../../../components/pagination-table/content/pagination-table-content.component';
import { filter, map, switchMap } from 'rxjs';
import { Enrollment, PaginationHttpOptions, rememberStudyPlaceId, WITH_STUDYPLACE_ID } from '@likdan/studyum-core';
import { PaginationTableComponent } from '../../../components/pagination-table/pagination-table.component';
import { PageEnrollmentsAcceptedService } from './page-enrollments-accepted.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEnrolmentsAcceptedEditComponent } from './dialogs/edit/page-enrolments-accepted-edit.component';

@Component({
  selector: 'app-page-enrollments-accepted',
  standalone: true,
  imports: [
    PaginationTableComponent,
  ],
  templateUrl: './page-enrollments-accepted.component.html',
  styleUrl: './page-enrollments-accepted.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEnrollmentsAcceptedComponent {
  displayColumns: DisplayColumn[] = [
    {
      title: 'enrollments_accepted_column_username',
      property: 'userName',
    },
    {
      title: 'enrollments_accepted_column_role',
      property: 'role',
    },
    {
      title: 'enrollments_accepted_column_type',
      property: 'typeTitle',
    },
    {
      title: 'enrollments_accepted_column_permissions',
      property: 'permissions',
    },
  ];

  options = rememberStudyPlaceId(() => <PaginationHttpOptions>{
    url: 'api/studyplaces/v1/studyplaces/enrollments',
    savePrevious: false,
    query: {
      accepted: true,
    },
    context: ctx => ctx.set(WITH_STUDYPLACE_ID, true),
  });

  private dialog = inject(MatDialog);
  private service = inject(PageEnrollmentsAcceptedService);

  actions: Action<Enrollment>[] = [
    {
      buttonType: 'icon',
      content: 'edit',
      action: item => this.dialog.open(PageEnrolmentsAcceptedEditComponent, { data: item })
        .afterClosed()
        .pipe(filter(v => !!v))
        .pipe(switchMap(v => this.service.edit(item.id, v))),
    },
    {
      buttonType: 'icon',
      content: 'delete',
      action: item => this.service.remove(item)
        .pipe(map(() => <PostActionOptions>{ removeRow: true })),
    },
  ];
}
