import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideLayoutGrid, LucideLoader } from '@lucide/angular';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { switchMap, finalize, catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [LucideLayoutGrid, LucideLoader, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  logInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit(): void {
    this.errorMessage.set('');
    if (this.logInForm.invalid) {
      this.logInForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    const loginRequest = this.logInForm.getRawValue();

    this.isLoading.set(true);

    this.authService
      .login(loginRequest)
      .pipe(
        switchMap(() =>
          this.authService.getMe().pipe(
            catchError((error) => {
              console.error('Fetch user data failed:', error);
              this.errorMessage.set('Login successful, but failed to load user profile.');
              return of(null);
            }),
          ),
        ),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (user) => {
          if (user) {
            console.log('Current user loaded successfully:', user);
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/error-or-setup-profile']);
          }
        },
        error: (error) => {
          console.error('Login request failed:', error);
          this.errorMessage.set('Invalid email or password. Please try again.');
        },
      });
  }
}
