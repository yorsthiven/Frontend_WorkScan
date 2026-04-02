import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse, LoginRequest } from '../../models/auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7064/api';

  // Usamos una señal para saber si el usuario está logueado en toda la app
  currentUser = signal<string | null>(localStorage.getItem('user'));
  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth`, credentials).pipe(
      tap((res) => {
        // Guardamos el token en el navegador
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', res.usuario);
        this.currentUser.set(res.usuario);
      }),
    );
  }

  logout() {
    localStorage.clear();
    this.currentUser.set(null);
  }
}
