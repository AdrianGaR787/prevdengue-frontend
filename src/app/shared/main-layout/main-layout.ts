import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.services';
import { MatMenuModule } from '@angular/material/menu';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { NotificationService } from '../../core/services/notification-service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatSidenavModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  
  // 🚀 2. Lo inyectamos como "opcional" por si acaso
  private socialAuthService = inject(SocialAuthService, { optional: true });

  // 🚀 Rol del usuario logueado, usado para mostrar/ocultar opciones del menú
  role: string | null = this.authService.getRole();

  /** true si el rol actual está dentro de la lista de roles permitidos */
  hasRole(...allowedRoles: string[]): boolean {
    return !!this.role && allowedRoles.includes(this.role);
  }

  onLogout() {
    // 1. Borramos el token de PrevDengue (Tu código original)
    this.authService.logout();

    // 🚀 3. Cerramos la sesión interna de Google para evitar el auto-login
    if (this.socialAuthService) {
      this.socialAuthService.signOut().catch(() => {
        // Ponemos este 'catch' silencioso porque si el usuario inició sesión
        // con correo y contraseña normal, Google lanzará un mini error de "No hay sesión",
        // así que simplemente lo ignoramos para que el logout fluya con normalidad.
      });
    }

    // 4. Redirigimos al Login
    this.router.navigate(['/http://localhost:4200/']);
  }
  activarNotificaciones() {
    this.notificationService.requestPermission();
  }

  probarSistemaAlertas() {
    this.notificationService.dispararNotificacionPrueba();
    console.log('⏱️ Tienes 5 segundos para minimizar el navegador o cambiar de pestaña...');
    
    // 🚀 Le damos 5 segundos de retraso para que te dé tiempo de ocultar la app
    setTimeout(() => {
      this.notificationService.dispararNotificacionPrueba();
    }, 5000);
  }
  }
