import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // Obtenemos los roles permitidos desde la configuración de la ruta
  const expectedRoles: string[] = route.data['roles'] || []; 
  const userRole = authService.getRole(); // El método que creamos en AuthService

  // --- LÍNEAS DE DEBUG ---
  console.log('🔍 Intentando entrar a ruta:', route.routeConfig?.path);
  console.log('👤 Rol extraído del Token:', userRole);
  console.log('🛡️ Roles que exige la ruta:', expectedRoles);
  // -----------------------

  
  if (userRole && expectedRoles.includes(userRole)) {
  console.log('✅ Acceso concedido');
  return true;
  } else {
    // 🛑 ACCESO DENEGADO: Mostramos el mensaje y redirigimos
    snackBar.open('⛔ Acceso denegado: No tienes los permisos necesarios para ver esta sección.', 'Entendido', { 
      duration: 5000,
      panelClass: ['error-snackbar'] // Opcional para darle color rojo en tu CSS
    });
    router.navigate(['/dashboard/reportes']); // Lo mandamos de vuelta a un lugar seguro
    return false;
  }
};