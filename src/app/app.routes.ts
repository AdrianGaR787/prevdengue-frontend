import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layout/main-layout/main-layout')
        .then(m => m.MainLayoutComponent),

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard')
            .then(m => m.Dashboard)
      },

      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reports/report-list/report-list')
            .then(m => m.ReportListComponent)
      },

      {
        path: 'alertas',
        loadComponent: () =>
          import('./features/alerts/alert-list/alert-list')
            .then(m => m.AlertList)
      },

      {
        path: 'campanias',
        loadComponent: () =>
          import('./features/campaigns/campaign-list/campaign-list')
            .then(m => m.CampaignList)
      },

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/users/user-list/user-list')
            .then(m => m.UserList)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];