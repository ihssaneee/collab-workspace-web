import {HttpInterceptorFn, HttpRequest, HttpHandlerFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

    const authService = inject(AuthService);
    const accessToken = authService.getAccessToken();

    if (!accessToken) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return next(authReq);
}