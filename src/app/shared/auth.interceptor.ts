import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token (normalmente del localStorage)
  const token = localStorage.getItem('token');

  // 2. Si el token existe, clonamos la petición y añadimos el header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  // 3. Si no hay token, la petición sigue su curso normal
  return next(req);
};
