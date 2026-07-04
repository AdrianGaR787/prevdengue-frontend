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
}
