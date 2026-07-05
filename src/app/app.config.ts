import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core'; // 🚀 Importamos importProvidersFrom
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// 🚀 Importaciones de Google
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) 
    ),
    provideAnimationsAsync(),

    // 🚀 LA SOLUCIÓN: Importamos el módulo raíz para evitar el error de InjectionToken
    importProvidersFrom(SocialLoginModule), 
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('413038221179-6qabb713ebjko62fst9g5348ilsmdab0.apps.googleusercontent.com', { // ⚠️ REEMPLAZA ESTO
              oneTapEnabled: false,
              prompt: 'select_account'
            })
          }
        ],
        onError: (err) => {
          console.error('Error de Google Auth:', err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};