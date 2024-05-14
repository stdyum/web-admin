import { inject, Injectable } from '@angular/core';
import { Enrollment } from '@likdan/studyum-core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageEnrollmentsAcceptedService {
  private http = inject(HttpClient);

  remove(enrollment: Enrollment): Observable<void> {
    return this.http.post<void>(`api/studyplaces/v1/studyplaces/enrollments/accept/${enrollment.id}`, { accepted: false });
  }

  edit(id: string, enrollment: Enrollment): Observable<void> {
    return this.http.patch<void>(`api/studyplaces/v1/studyplaces/enrollments/${id}`, enrollment);
  }
}
