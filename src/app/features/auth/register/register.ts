import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { LucideLayoutGrid, LucideLoader } from '@lucide/angular';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [LucideLayoutGrid, LucideLoader, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit(): void {
    this.errorMessage.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        void this.router.navigate(['/login']);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.errorMessage.set(readRegisterError(error));
      },
    });
  }
}

function readRegisterError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Could not create your account';
  }

  const descriptions = identityDescriptions(error.error);
  if (descriptions.length > 0) {
    return descriptions.join(' ');
  }

  return 'Could not create your account';
}

function identityDescriptions(body: unknown): string[] {
  if (!Array.isArray(body)) {
    return [];
  }

  return body.flatMap((item) => {
    if (!item || typeof item !== 'object' || !('description' in item)) {
      return [];
    }

    const description = item.description;
    return typeof description === 'string' && description.length > 0 ? [description] : [];
  });
}
