import { Component } from '@angular/core';
import { LucideLayoutGrid } from '@lucide/angular';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-login',
  imports: [LucideLayoutGrid, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  logInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
}
