import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./app.component').then(c => c.AppComponent), children: [
      {
        path: 'enrollments',
        children: [
          {
            path: 'accepted',
            loadComponent: () => import('./pages/enrollments/accepted/page-enrollments-accepted.component').then(c => c.PageEnrollmentsAcceptedComponent),
          },
          {
            path: 'requests',
            loadComponent: () => import('./pages/enrollments/requests/page-enrollments-requests.component').then(c => c.PageEnrollmentsRequestsComponent),
          },
        ],
      },
      {
        path: 'registry',
        children: [
          {
            path: 'groups',
            loadComponent: () => import('./pages/registry/groups/page-registry-groups.component').then(c => c.PageRegistryGroupsComponent),
          },
          {
            path: 'rooms',
            loadComponent: () => import('./pages/registry/rooms/page-registry-rooms.component').then(c => c.PageRegistryRoomsComponent),
          },
          {
            path: 'students',
            loadComponent: () => import('./pages/registry/students/page-registry-students.component').then(c => c.PageRegistryStudentsComponent),
          },
          {
            path: 'subjects',
            loadComponent: () => import('./pages/registry/subjects/page-registry-subjects.component').then(c => c.PageRegistrySubjectsComponent),
          },
          {
            path: 'teachers',
            loadComponent: () => import('./pages/registry/teachers/page-registry-teachers.component').then(c => c.PageRegistryTeachersComponent),
          },
          {
            path: 'students_groups',
            loadComponent: () => import('./pages/registry/students_groups/page-registry-students-groups.component').then(c => c.PageRegistryStudentsGroupsComponent),
          },
        ],
      },
      {
        path: '**', redirectTo: 'registry/groups',
      },
    ],
  },
  {
    path: '**', redirectTo: 'registry/groups',
  },
];
