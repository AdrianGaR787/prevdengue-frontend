import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { JwtRequest, JwtResponse, DecodedToken, User } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'prevdengue_token';
  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(this.decodeStoredToken());
  currentUser$ = this.currentUserSubject.asObservable();

  // ─── Login JWT ─────────────────────────────────────────────────────────────
  login(credentials: JwtRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.currentUserSubject.next(jwtDecode<DecodedToken>(res.token));
      })
    );
  }

  // ─── Login con Google (OAuth2) ──────────────────────────────────────────────
  // El backend recibe el id_token de Google y devuelve un JWT propio.
  // Tu Spring Boot necesita un endpoint POST /auth/google que valide el token de Google.
  loginWithGoogle(idToken: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/auth/google`, { idToken }).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.currentUserSubject.next(jwtDecode<DecodedToken>(res.token));
      })
    );
  }

  // ─── Logout ────────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ─── Token helpers ────────────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser(): DecodedToken | null {
    return this.currentUserSubject.getValue();
  }

  getRole(): string {
    return this.getCurrentUser()?.role ?? '';
  }

  getUsername(): string {
    return this.getCurrentUser()?.sub ?? '';
  }

  isAdmin():      boolean { return this.getRole() === 'ADMIN'; }
  isBrigadista(): boolean { return this.getRole() === 'BRIGADISTA'; }
  isCiudadano():  boolean { return this.getRole() === 'CIUDADANO'; }

  hasAnyRole(...roles: string[]): boolean {
    return roles.includes(this.getRole());
  }

 decodeStoredToken(): DecodedToken | null {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('jwt');
    if (token) {
      return jwtDecode<DecodedToken>(token);
    }
  }
  return null;
}
}