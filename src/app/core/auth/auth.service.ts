import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, shareReplay, tap, throwError } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RegisterRequest } from '../models/register-request.model';
import { RegisterResponse } from '../models/register-response.model';
import { environment } from '../../../environments/environment';
import { CurrentUser } from '../models/current-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private accessToken = signal<string | null>(null);
  private refreshInFlight: Observable<LoginResponse> | null = null;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.api}/auth/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.accessToken.set(response.accessToken);
        }),
      );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.api}/auth/register`, request);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  getMe(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${environment.api}/auth/me`);
  }

  refresh(): Observable<LoginResponse> {
    if (this.refreshInFlight) {
      return this.refreshInFlight;
    }

    const refresh$ = this.http
      .post<LoginResponse>(`${environment.api}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.accessToken.set(response.accessToken);
        }),
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.accessToken.set(null);
          }

          return throwError(() => error);
        }),
        finalize(() => {
          this.refreshInFlight = null;
        }),
        shareReplay(1),
      );

    this.refreshInFlight = refresh$;
    return refresh$;
  }
}
