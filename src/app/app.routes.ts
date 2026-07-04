import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    // Usamos lazy loading (carga perezosa) recomendada en Angular moderno
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
  path: 'registro',
  loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    // Este será tu layout principal (barra superior, menú lateral)
    loadComponent: () => import('./shared/main-layout/main-layout').then(m => m.MainLayoutComponent),
    canActivate: [authGuard], // Toda esta sección requiere estar logueado
    children: [
      {
        path: 'reportes',
        loadComponent: () => import('./features/reports/report-list/report-list').then(m => m.ReportListComponent),
        canActivate: [roleGuard],
        // Aquí conectamos con tu backend: ReportController pide ADMIN, CIUDADANO o BRIGADISTA
        data: { roles: ['ADMIN', 'BRIGADISTA', 'CIUDADANO'] } 
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/users/user-list/user-list').then(m => m.UserList),
        canActivate: [roleGuard],
        // El UserController pide ADMIN para listar
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
        data: { roles: ['ADMIN'] } // 🔒 Solo el ADMIN puede crear usuarios desde el panel
        },
      {
        path: 'reportes/nuevo', // NUEVA RUTA
        loadComponent: () => import('./features/reports/report-insert/report-insert').then(m => m.ReportInsertComponent),
        canActivate: [roleGuard],
        data: { roles: ['CIUDADANO','ADMIN'] } // ¡Restricción de seguridad aplicada!
      },
      {
        path: 'reportes/editar/:id',
        loadComponent: () => import('./features/reports/report-insert/report-insert').then(m => m.ReportInsertComponent),
        canActivate: [roleGuard],
        data: { roles: ['CIUDADANO', 'ADMIN'] }
      },   // Iremos agregando aquí distritos, campañas, etc.
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
    { path: 'roles', loadComponent: () => import('./features/roles/role-list/role-list').then(m => m.RoleListComponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
    { path: 'roles/nuevo', loadComponent: () => import('./features/roles/role-insert/role-insert').then(m => m.RoleInsertComponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
    { path: 'roles/editar/:id', loadComponent: () => import('./features/roles/role-insert/role-insert').then(m => m.RoleInsertComponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },

    { path: 'niveles-riesgo', loadComponent: () => import('./features/risk-levels/risk-level-list/risk-level-list').then(m => m.RiskLevelListComponent), canActivate: [roleGuard], data: { roles: ['ADMIN', 'BRIGADISTA'] } },
    { path: 'niveles-riesgo/nuevo', loadComponent: () => import('./features/risk-levels/risk-level-insert/risk-level-insert').then(m => m.RiskLevelInsertComponent), canActivate: [roleGuard], data: { roles: ['ADMIN', 'BRIGADISTA'] } },
    { path: 'niveles-riesgo/editar/:id', loadComponent: () => import('./features/risk-levels/risk-level-insert/risk-level-insert').then(m => m.RiskLevelInsertComponent), canActivate: [roleGuard], data: { roles: ['ADMIN', 'BRIGADISTA'] } }
    ]
  },
  {
    path: '**', // Cualquier ruta no encontrada
    redirectTo: 'login'
  }
];