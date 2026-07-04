import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.services';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true; // Si hay token, lo dejamos pasar
  }

  // Si no hay token, lo redirigimos al login
  router.navigate(['/login']);
  return false;
};