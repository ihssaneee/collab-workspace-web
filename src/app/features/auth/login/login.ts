import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideLayoutGrid, LucideLoader } from '@lucide/angular';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

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
      next: () => {
        this.authService.getMe().subscribe({
          next:(user)=>{
            console.log('current user:', user);
            this.isLoading.set(false);
            this.router.navigate(['/']);
            

          },
          error:(error) => {
            console.error('Failed to get current user:', error);
            this.isLoading.set(false);

          }
        })
        
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password');
      }
    });
  }
  
}
