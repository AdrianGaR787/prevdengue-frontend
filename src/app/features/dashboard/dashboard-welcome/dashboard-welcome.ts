import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.services';
import { UserService } from '../../../core/services/user.services';

interface QuickLink {
  label: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard-welcome.html',
  styleUrls: ['./dashboard-welcome.css']
})
export class DashboardWelcomeComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  userName: string | null = null;
  role: string | null = this.authService.getRole();

  // 🚀 Accesos rápidos según el rol del usuario logueado
  quickLinks: QuickLink[] = [];

  ngOnInit() {
    const email = this.authService.getEmail();
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => this.userName = user?.name || null,
        error: () => this.userName = null
      });
    }
    this.quickLinks = this.buildQuickLinks();
  }

  private buildQuickLinks(): QuickLink[] {
    const common: QuickLink[] = [
      {
        label: 'Registrar un reporte',
        description: 'Reporta un posible foco de dengue en tu zona.',
        icon: 'add_location',
        route: '/dashboard/reportes/nuevo',
        color: 'var(--success)'
      },
      {
        label: 'Ver reportes',
        description: 'Revisa la bandeja general de reportes ciudadanos.',
        icon: 'list_alt',
        route: '/dashboard/reportes',
        color: 'var(--primary)'
      },
      {
        label: 'Eventos de limpieza',
        description: 'Únete o consulta las próximas jornadas comunitarias.',
        icon: 'volunteer_activism',
        route: '/dashboard/cleaning-events',
        color: 'var(--cta-orange)'
      },
      {
        label: 'Síntomas frecuentes',
        description: 'Consulta los síntomas más reportados últimamente.',
        icon: 'analytics',
        route: '/dashboard/sintomas/mas-frecuentes',
        color: '#60A5FA'
      },
    ];

    if (this.role === 'ADMIN' || this.role === 'BRIGADISTA') {
      common.push(
        {
          label: 'Panel analítico',
          description: 'Estadísticas y reportes filtrados por distrito.',
          icon: 'dashboard',
          route: '/dashboard/queries',
          color: 'var(--primary-dark)'
        },
        {
          label: 'Alertas predictivas',
          description: 'Zonas de riesgo según el modelo predictivo.',
          icon: 'insights',
          route: '/dashboard/predictive-alerts',
          color: 'var(--danger)'
        },
        {
          label: 'Campañas de intervención',
          description: 'Gestiona fumigaciones y campañas oficiales.',
          icon: 'health_and_safety',
          route: '/dashboard/campaigns',
          color: 'var(--success-dark)'
        }
      );
    }

    if (this.role === 'ADMIN') {
      common.push({
        label: 'Administrar usuarios',
        description: 'Gestiona cuentas, roles y permisos del sistema.',
        icon: 'people',
        route: '/dashboard/usuarios',
        color: 'var(--text-muted)'
      });
    }

    return common;
  }
}
