export interface LoginRequest {
  email: string;
  password:  string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  expiracion: string;
  email: string;
  usuario: UsuarioResp;
  // Agrega aquí otros campos que devuelva tu API (rol, expiración, etc.)
}

export interface UsuarioResp {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}
