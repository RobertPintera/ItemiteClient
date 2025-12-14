import {CanActivateFn, Router} from '@angular/router';
import {inject, PLATFORM_ID} from '@angular/core';
import {AuthService} from '../../services/auth-service/auth.service';
import {isPlatformBrowser} from '@angular/common';

export const AuthGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if(!isPlatformBrowser(platformId)) return router.createUrlTree(['/login']);

  return authService.isUserLoggedIn() ? true : router.createUrlTree(['/login']);
};
