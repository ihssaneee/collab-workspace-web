import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  const refreshUrl = `${environment.api}/auth/refresh`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('retries a 401 once with the refreshed access token', () => {
    let body: unknown;

    http.get('/api/projects').subscribe((response) => {
      body = response;
    });

    httpMock.expectOne('/api/projects').flush(null, { status: 401, statusText: 'Unauthorized' });

    const refresh = httpMock.expectOne(refreshUrl);
    expect(refresh.request.method).toBe('POST');
    expect(refresh.request.withCredentials).toBe(true);
    refresh.flush({ accessToken: 'new-token' });

    const retry = httpMock.expectOne('/api/projects');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer new-token');
    retry.flush({ name: 'Alpha' });

    expect(body).toEqual({ name: 'Alpha' });
    expect(authService.getAccessToken()).toBe('new-token');
    httpMock.expectNone(refreshUrl);
  });

  it('does not call refresh again when the refresh endpoint returns 401', () => {
    authService.login({ email: 'jane@example.com', password: 'secret1' }).subscribe();
    httpMock
      .expectOne(`${environment.api}/auth/login`)
      .flush({ accessToken: 'expired-token' });

    let status: number | undefined;
    http.get('/api/projects').subscribe({
      error: (error: HttpErrorResponse) => {
        status = error.status;
      },
    });

    const initial = httpMock.expectOne('/api/projects');
    expect(initial.request.headers.get('Authorization')).toBe('Bearer expired-token');
    initial.flush(null, { status: 401, statusText: 'Unauthorized' });

    httpMock.expectOne(refreshUrl).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(status).toBe(401);
    expect(authService.getAccessToken()).toBeNull();
    httpMock.expectNone(refreshUrl);
  });

  it('shares one refresh across concurrent 401 responses', () => {
    http.get('/api/a').subscribe();
    http.get('/api/b').subscribe();

    httpMock.expectOne('/api/a').flush(null, { status: 401, statusText: 'Unauthorized' });
    httpMock.expectOne('/api/b').flush(null, { status: 401, statusText: 'Unauthorized' });

    const refreshes = httpMock.match(refreshUrl);
    expect(refreshes).toHaveLength(1);
    refreshes[0].flush({ accessToken: 'shared-token' });

    const retryA = httpMock.expectOne('/api/a');
    const retryB = httpMock.expectOne('/api/b');
    expect(retryA.request.headers.get('Authorization')).toBe('Bearer shared-token');
    expect(retryB.request.headers.get('Authorization')).toBe('Bearer shared-token');
    retryA.flush({});
    retryB.flush({});
  });

  it('does not refresh after a failed login', () => {
    http.post(`${environment.api}/auth/login`, {}).subscribe({
      error: () => undefined,
    });

    httpMock
      .expectOne(`${environment.api}/auth/login`)
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    httpMock.expectNone(refreshUrl);
  });
});
