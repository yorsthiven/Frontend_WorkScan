import { HttpInterceptorFn } from '@angular/common/http';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  // return next(req);
  const authReq = req.clone({
    setHeaders: {
      'ngrok-skip-browser-warning': 'true',
    },
  });

  return next(authReq);
};
