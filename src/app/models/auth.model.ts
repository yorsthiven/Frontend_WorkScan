export interface LoginRequest {
  email: string;
  password:  string;
}

export interface AuthResponse {
  token: string;
  usuario: string;
  // Agrega aquí otros campos que devuelva tu API (rol, expiración, etc.)
}
