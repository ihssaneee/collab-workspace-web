import { Component, inject, signal } from '@angular/core';
import { LucideLayoutGrid,LucideLoader } from '@lucide/angular';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';



@Component({
  selector: 'app-login',
  imports: [ LucideLayoutGrid, LucideLoader, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})


export class Login {

  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);

  logInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading= signal(false);
  errorMessage= signal('');

  onSubmit(): void {
    this.errorMessage.set('');
    if (this.logInForm.invalid) {
      this.logInForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    const loginRequest = this.logInForm.getRawValue();

    this.isLoading.set(true);
    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password');
      }
    });
  }
  
}
