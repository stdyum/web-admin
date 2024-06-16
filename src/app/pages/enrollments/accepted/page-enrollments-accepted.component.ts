import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  Action,
  DisplayColumn,
  PostActionOptions,
} from '../../../components/pagination-table/content/pagination-table-content.component';
import { filter, map, Observable, switchMap } from 'rxjs';
import {
  ConfirmationDialog,
  Enrollment,
  PaginationHttpOptions,
  rememberStudyPlaceId,
  TranslationService,
  WITH_STUDYPLACE_ID,
} from '@likdan/studyum-core';
import { PaginationTableComponent } from '../../../components/pagination-table/pagination-table.component';
import { PageEnrollmentsAcceptedService } from './page-enrollments-accepted.service';
import { MatDialog } from '@angular/material/dialog';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

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
  options = rememberStudyPlaceId(() => <PaginationHttpOptions>{
    url: 'api/studyplaces/v1/studyplaces/enrollments',
    savePrevious: false,
    query: {
      accepted: true,
    },
    context: ctx => ctx.set(WITH_STUDYPLACE_ID, true),
  });
  actions: Action<Enrollment>[] = [
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
  private translation = inject(TranslationService);
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
      transform: (permissions: string[]) => computed(() => {
        return permissions
          ? permissions
            .map(p => this.translation.getTranslation(`permission_${p}`)())
            .join(', ')
          : '-';
      }),
    },
  ];
  private dialog = inject(MatDialog);
  private service = inject(PageEnrollmentsAcceptedService);

  update(item: Enrollment): Observable<PostActionOptions> {
    return fromPromise(import('./dialogs/edit/page-enrolments-accepted-edit.component'))
      .pipe(map(c => c.PageEnrolmentsAcceptedEditComponent))
      .pipe(switchMap(c => this.dialog.open(c, { data: item }).afterClosed()))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.update(item.id, v).pipe(map(() => v))))
      .pipe(map(v => <PostActionOptions>{ updateRow: { ...item, ...v } }));
  }

  delete(item: Enrollment): Observable<PostActionOptions> {
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
