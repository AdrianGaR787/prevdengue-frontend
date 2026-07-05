import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { CleaningEventsComponent } from './features/cleaning-events/cleaning-events/cleaning-events';
import { InterventionCampaignsComponent } from './features/intervention-campaigns/intervention-campaigns';
import { PredictiveAlertsDashboardComponent } from './features/dashboard/predictive-alerts-dashboard/predictive-alerts-dashboard';
import { LandingPage } from './public/landing-page/landing-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./shared/main-layout/main-layout').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [

      // 🏠 RUTA DE INICIO: lo primero que se ve al hacer login, evita la pantalla en blanco
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
      },
      {
        path: 'inicio',
        loadComponent: () => import('./features/dashboard/dashboard-welcome/dashboard-welcome').then(m => m.DashboardWelcomeComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA', 'CIUDADANO'] }
      },

      // 🚀 2. NUEVA RUTA DEL PANEL ANALÍTICO
      {
        path: 'queries',
        loadComponent: () => import('./features/dashboard/dashboard-home/dashboard-home').then(m => m.DashboardHomeComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA'] } // El ciudadano común no necesita ver analítica general
      },

      {
        path: 'reportes',
        loadComponent: () => import('./features/reports/report-list/report-list').then(m => m.ReportList),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA', 'CIUDADANO'] } 
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/users/user-list/user-list').then(m => m.UserList),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] } 
      },
      {
        path: 'usuarios/editar/:id',
        loadComponent: () => import('./features/users/user-insert/user-insert').then(m => m.UserInsert),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'usuarios/nuevo',
        loadComponent: () => import('./features/users/user-insert/user-insert').then(m => m.UserInsert),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'usuarios/top-participacion',
        loadComponent: () => import('./features/users/top-users/top-users').then(m => m.UserTopComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] } // Ajusta los roles según prefieras
      },
      {
        path: 'reportes/nuevo',
        loadComponent: () => import('./features/reports/report-insert/report-insert').then(m => m.ReportInsertComponent),
        canActivate: [roleGuard],
        data: { roles: ['CIUDADANO','ADMIN'] }
      },
      {
        path: 'reportes/editar/:id',
        loadComponent: () => import('./features/reports/report-insert/report-insert').then(m => m.ReportInsertComponent),
        canActivate: [roleGuard],
        data: { roles: ['CIUDADANO', 'ADMIN'] }
      },
      {
        path: 'distritos',
        loadComponent: () => import('./features/districts/district-list/district-list').then(m => m.DistrictLisst),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'distritos/nuevo',
        loadComponent: () => import('./features/districts/district-insert/district-insert').then(m => m.DistricInsert),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'distritos/editar/:id',
        loadComponent: () => import('./features/districts/district-insert/district-insert').then(m => m.DistricInsert),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'criaderos',
        loadComponent: () => import('./features/hatchery-types/hatchery-type-list/hatchery-type-list').then(m => m.HatcheryTypeListComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA'] }
      },
      {
        path: 'criaderos/nuevo',
        loadComponent: () => import('./features/hatchery-types/hatchery-type-insert/hatchery-type-insert').then(m => m.HatcheryTypeInsertComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA'] }
      },
      {
        path: 'criaderos/editar/:id',
        loadComponent: () => import('./features/hatchery-types/hatchery-type-insert/hatchery-type-insert').then(m => m.HatcheryTypeInsertComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA'] }
      },
      {
        path: 'sintomas',
        loadComponent: () => import('./features/symptoms/symptom-list/symptom-list').then(m => m.SymptomListComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA'] }
      },
      {
        path: 'sintomas/nuevo',
        loadComponent: () => import('./features/symptoms/symptom-insert/symptom-insert').then(m => m.SymptomInsertComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA'] }
      },
      {
        path: 'sintomas/editar/:id',
        loadComponent: () => import('./features/symptoms/symptom-insert/symptom-insert').then(m => m.SymptomInsertComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA'] }
      },
      {
        path: 'sintomas/mas-frecuentes',
        loadComponent: () => import('./features/symptoms/symptom-top/symptom-topusers').then(m => m.SymptomTopUsersComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA', 'CIUDADANO'] }
      },
      { 
        path: 'roles', 
        loadComponent: () => import('./features/roles/role-list/role-list').then(m => m.RoleListComponent), 
        canActivate: [roleGuard], 
        data: { roles: ['ADMIN'] } 
      },
      { 
        path: 'roles/nuevo', 
        loadComponent: () => import('./features/roles/role-insert/role-insert').then(m => m.RoleInsertComponent), 
        canActivate: [roleGuard], 
        data: { roles: ['ADMIN'] } 
      },
      { 
        path: 'roles/editar/:id', 
        loadComponent: () => import('./features/roles/role-insert/role-insert').then(m => m.RoleInsertComponent), 
        canActivate: [roleGuard], 
        data: { roles: ['ADMIN'] } 
      },
      { 
        path: 'niveles-riesgo', 
        loadComponent: () => import('./features/risk-levels/risk-level-list/risk-level-list').then(m => m.RiskLevelListComponent), 
        canActivate: [roleGuard], 
        data: { roles: ['ADMIN', 'BRIGADISTA'] } 
      },
      { 
        path: 'niveles-riesgo/nuevo', 
        loadComponent: () => import('./features/risk-levels/risk-level-insert/risk-level-insert').then(m => m.RiskLevelInsertComponent), 
        canActivate: [roleGuard], 
        data: { roles: ['ADMIN', 'BRIGADISTA'] } 
      },
      { 
        path: 'niveles-riesgo/editar/:id', 
        loadComponent: () => import('./features/risk-levels/risk-level-insert/risk-level-insert').then(m => m.RiskLevelInsertComponent), 
        canActivate: [roleGuard], 
        data: { roles: ['ADMIN', 'BRIGADISTA'] } 
      },
      {
        path: 'cleaning-events',
        component: CleaningEventsComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA', 'CIUDADANO'] } // Eventos comunitarios: abiertos a todos los roles
      },
      {
        path: 'campaigns',
        component: InterventionCampaignsComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA'] } // Gestión de campañas: solo personal autorizado
      },
      {
        path: 'predictive-alerts',
        component: PredictiveAlertsDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'BRIGADISTA'] } // Panel analítico: igual que 'queries'
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];