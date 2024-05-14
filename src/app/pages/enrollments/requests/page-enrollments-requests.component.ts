import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PaginationTableComponent } from '../../../components/pagination-table/pagination-table.component';
import { Enrollment, PaginationHttpOptions, rememberStudyPlaceId, WITH_STUDYPLACE_ID } from '@likdan/studyum-core';
import {
  Action,
  DisplayColumn,
  PostActionOptions,
} from '../../../components/pagination-table/content/pagination-table-content.component';
import { PageEnrollmentsRequestsService } from './page-enrollments-requests.service';
import { map } from 'rxjs';

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

  private service = inject(PageEnrollmentsRequestsService);

  actions: Action<Enrollment>[] = [
    {
      buttonType: 'icon',
      content: 'check',
      action: item => this.service.accept(item)
        .pipe(map(() => <PostActionOptions>{ removeRow: true })),
    },
    {
      buttonType: 'icon',
      content: 'close',
      action: item => this.service.block(item)
        .pipe(map(() => <PostActionOptions>{ removeRow: true })),
    },
  ];
}
