import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse, LoginRequest } from '../../models/auth.model';
import { tap } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  // private apiUrl = 'https://localhost:7064/api';
  private apiUrl = `${environment.apiUrl}/Auth`;

  // Usamos una señal para saber si el usuario está logueado en toda la app
  currentUser = signal<string | null>(localStorage.getItem('user'));
  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}`, credentials).pipe(
      tap((res:AuthResponse) => {
        console.log(res);
        // Guardamos el token en el navegador
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', res.usuario.id);
        this.currentUser.set(res.usuario.nombre);
      }),
    );
  }

  logout() {
    // Borra el token y cualquier info del usuario del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('user_data'); // Si guardas el nombre o rol

    // Si usas SessionStorage, puedes limpiarlo también
    sessionStorage.clear();

    // Opcional: Si usas una señal (signal) para el estado del usuario, resetéala
    // this.currentUser.set(null);
  }
}
