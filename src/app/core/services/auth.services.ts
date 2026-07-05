import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { JwtRequestDTO, JwtResponseDTO } from '../models/Auth'; 
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.base}`;

  constructor(private http: HttpClient) {}

  login(credentials: JwtRequestDTO) {
    return this.http.post<JwtResponseDTO>(`${this.url}/login`, credentials).pipe(
      tap(response => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('token', response.jwttoken); // O localStorage
        }
      })
    );
  }
  // 🚀 1. Método para enviar el Token de Google a Spring Boot
  loginWithGoogle(token: string) {
    // Apuntamos al endpoint @PostMapping("/google") que creaste en tu JwtAuthenticationController
    return this.http.post<any>(`${this.url}/google`, { token: token });
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  logout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
    }
  }

  // Decodificar payload para roles (puedes usar jwt-decode npm package)
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      // Convertimos el formato Base64Url a Base64 estándar para evitar errores de lectura
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(window.atob(base64));
      
      // --- LÍNEA DE DEBUG CLAVE ---
      console.log('📦 Contenido COMPLETO del token:', decoded);
      
      return decoded.roles; 
    } catch (e) {
      console.error('Error decodificando el token', e);
      return null;
    }
  }
  // 🚀 Extrae el correo del token JWT de PrevDengue
  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(window.atob(base64));
      
      // Spring Security guarda el correo (username) en la propiedad 'sub' (subject)
      return decoded.sub; 
    } catch (e) {
      console.error('Error decodificando el token para sacar el correo', e);
      return null;
    }
  }
}
