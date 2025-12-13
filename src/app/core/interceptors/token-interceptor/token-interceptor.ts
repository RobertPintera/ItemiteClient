import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('api.geoapify.com')) {
    return next(req);
  }

  const modifiedReq = req.clone({ withCredentials: true });
  return next(modifiedReq);
};
