import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PaginationTableComponent } from '../../../components/pagination-table/pagination-table.component';
import {
  ConfirmationDialog,
  Enrollment,
  PaginationHttpOptions,
  rememberStudyPlaceId,
  WITH_STUDYPLACE_ID,
} from '@likdan/studyum-core';
import {
  Action,
  DisplayColumn,
  PostActionOptions,
} from '../../../components/pagination-table/content/pagination-table-content.component';
import { PageEnrollmentsRequestsService } from './page-enrollments-requests.service';
import { filter, map, Observable, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-page-enrollments-requests',
  standalone: true,
  imports: [
    PaginationTableComponent,
  ],
  templateUrl: './page-enrollments-requests.component.html',
  styleUrl: './page-enrollments-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEnrollmentsRequestsComponent {
  displayColumns: DisplayColumn[] = [
    {
      title: 'Username',
      property: 'userName',
    },
    {
      title: 'Role',
      property: 'role',
    },
    {
      title: 'Type',
      property: 'typeTitle',
    },
  ];
  options = rememberStudyPlaceId(() => <PaginationHttpOptions>{
    url: 'api/studyplaces/v1/studyplaces/enrollments',
    savePrevious: false,
    query: {
      accepted: false,
    },
    context: ctx => ctx.set(WITH_STUDYPLACE_ID, true),
  });
  actions: Action<Enrollment>[] = [
    {
      buttonType: 'icon',
      content: 'check',
      action: this.accept.bind(this),
    },
    {
      buttonType: 'icon',
      content: 'close',
      action: this.block.bind(this),
    },
  ];
  private dialog = inject(MatDialog);
  private service = inject(PageEnrollmentsRequestsService);

  private accept(item: Enrollment): Observable<PostActionOptions> {
    return this.service.accept(item)
      .pipe(map(() => <PostActionOptions>{ removeRow: true }));
  }

  private block(item: Enrollment): Observable<PostActionOptions> {
    return this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'dialogs_block_confirmation_title',
        body: 'dialogs_block_confirmation_body',
        confirmButtonText: 'dialogs_block_confirmation_confirm_button',
        confirmButtonColor: 'error',
        cancelButtonText: 'dialogs_block_confirmation_cancel_button',
      },
    })
      .afterClosed()
      .pipe(filter(v => !!v))
      .pipe(switchMap(() => this.service.block(item)))
      .pipe(map(() => <PostActionOptions>{ removeRow: true }));
  }
}
