import { ApplicationConfig, provideBrowserGlobalErrorListeners,provideAppInitializer,inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/http/auth.interceptor';
import { firstValueFrom, of , catchError} from 'rxjs';
import { AuthService } from './core/auth/auth.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      const authService = inject(AuthService);

      return firstValueFrom(
        authService.restoreSession().pipe(
          catchError(() => of(null))
        )
      );
    }),
      
  ]
};
