import { Component, inject, signal } from '@angular/core';
import { MaterialModules } from '../../../shared/material.providers';
import { FormsModules } from '../../../shared/shared-forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/login/AuthService';

@Component({
  selector: 'app-login-component',
  imports: [MaterialModules, FormsModules],
  templateUrl: './login-component.html',
})
export class LoginComponent {

  loginForm : FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);

  // 1. Creamos las señales
  isLoading = signal(false);
  hidePassword = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // 2. Método para cambiar la visibilidad (Toggle)
  togglePassword() {
    this.hidePassword.update(prev => !prev);
  }


  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          console.log('Login exitoso, Token guardado');
          this.router.navigate(['/dashboard']); // ¡Bienvenido a WorkScan!
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Credenciales incorrectas. Intenta de nuevo.');
          console.error(err);
        }
      });
    }

  // onLogin() {
  //   if (this.loginForm.valid) {
  //     this.isLoading.set(true); // Activamos carga
  //     this.errorMessage.set(null);

  //     console.log('Enviando datos...', this.loginForm.value);

  //     // Simulemos la espera de la API
  //     setTimeout(() => {
  //       this.isLoading.set(false);
  //       this.router.navigate(['/trabajadores']);
  //     }, 2000);
  //   }
   }
}
