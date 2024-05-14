import { inject, Injectable } from '@angular/core';
import { Enrollment } from '@likdan/studyum-core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageEnrollmentsRequestsService {
  private http = inject(HttpClient);

  accept(enrollment: Enrollment): Observable<void> {
    return this.http.post<void>(`api/studyplaces/v1/studyplaces/enrollments/accept/${enrollment.id}`, { accepted: true });
  }

  block(enrollment: Enrollment): Observable<void> {
    return this.http.post<void>(`api/studyplaces/v1/studyplaces/enrollments/block/${enrollment.id}`, { blocked: true });
  }
}
