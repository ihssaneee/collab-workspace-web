import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { Register } from './register';
import { AuthService } from '../../../core/auth/auth.service';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let register: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    register = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { register },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps submit disabled until the form is valid', async () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);

    component.registerForm.setValue({
      username: 'jane',
      email: 'jane@example.com',
      password: 'secret1',
    });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.disabled).toBe(false);
  });

  it('registers the account and opens the login page', () => {
    register.mockReturnValue(of({ message: 'User registered successfully' }));
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    component.registerForm.setValue({
      username: 'jane',
      email: 'jane@example.com',
      password: 'secret1',
    });

    component.onSubmit();

    expect(register).toHaveBeenCalledWith({
      username: 'jane',
      email: 'jane@example.com',
      password: 'secret1',
    });
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('shows the identity error returned by the API', async () => {
    register.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: [{ code: 'DuplicateUserName', description: "Username 'jane' is already taken." }],
          }),
      ),
    );

    component.registerForm.setValue({
      username: 'jane',
      email: 'jane@example.com',
      password: 'secret1',
    });

    component.onSubmit();
    fixture.detectChanges();
    await fixture.whenStable();

    const error = fixture.nativeElement.querySelector('p.text-red-400') as HTMLElement;
    expect(error.textContent).toContain("Username 'jane' is already taken.");
    expect(component.isLoading()).toBe(false);
  });
});
