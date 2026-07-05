import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.services';
import { JwtRequestDTO } from '../../../core/models/Auth';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
    GoogleSigninButtonModule
  ],
  // 🚀 Ya no necesitamos el bloque 'providers' aquí adentro
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  credentials: JwtRequestDTO = { username: '', password: '' };
  errorMessage: string = '';
  loading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Inyección opcional por seguridad extrema
  private socialAuthService = inject(SocialAuthService, { optional: true });
  private platformId = inject(PLATFORM_ID);
  
  isBrowser = signal(false);

ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser.set(true); 

      if (this.socialAuthService) {
        this.socialAuthService.authState.subscribe((socialUser) => {
          if (socialUser) {
            console.log('¡Google respondió! Enviando token a Spring Boot...');
            
            // 🚀 2. Enviamos el idToken a tu backend de Java
            this.authService.loginWithGoogle(socialUser.idToken).subscribe({
              next: (res: any) => {
                console.log('¡Backend generó el JWT de PrevDengue!', res);
                
                // 🚀 1. GUARDAMOS EL TOKEN EN LA SESIÓN (La llave de acceso)
                sessionStorage.setItem('token', res.jwttoken); 
                
                // 🚀 2. REDIRIGIMOS AL DASHBOARD (Ahora el Guard sí nos dejará pasar)
                this.router.navigate(['/dashboard']);
              },
              error: (err) => {
                // Si el backend lanza el error de que no está registrado, lo mostramos en pantalla
                if (err.error && err.error.error) {
                  this.errorMessage = err.error.error; 
                } else {
                  this.errorMessage = 'Error al validar la cuenta con el servidor.';
                }
                console.error('Error del backend:', err);
              }
            });
          }
        });
      }
    }
  }


  onLogin() {
    this.errorMessage = '';
    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.status === 401 || err?.status === 403
          ? 'Correo o contraseña incorrectos. Verifica tus datos e intenta nuevamente.'
          : 'No se pudo iniciar sesión. Verifica tu conexión e intenta nuevamente.';
        console.error(err);
      }
    });
  }
}