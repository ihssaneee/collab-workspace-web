import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { environment } from '../../../environments/environment';
import { CurrentUser } from '../models/current-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private accessToken = signal<string | null>(null);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.api}/auth/login`, credentials, {
      withCredentials: true,
    })
    .pipe(tap(response=>{
      this.accessToken.set(response.accessToken);
    }

    ))
    ;
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  getMe(): Observable<CurrentUser> {
  return this.http.get<CurrentUser>(
    `${environment.api}/auth/me`
  );
}

refresh(): Observable<LoginResponse> {

  return this.http.post<LoginResponse>(
    `${environment.api}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  ).pipe(
    tap(response => {
      this.accessToken.set(response.accessToken);
    })
  );
}
}
