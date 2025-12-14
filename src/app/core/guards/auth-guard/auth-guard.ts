import {CanActivateFn, Router} from '@angular/router';
import {inject, PLATFORM_ID} from '@angular/core';
import {UserService} from '../../services/user-service/user.service';
import {isPlatformBrowser} from '@angular/common';

export const authGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const userService = inject(UserService);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const allowedForGuests = ['/me'];
  if (allowedForGuests.includes(state.url)) {
    return true;
  }

  await userService.OnServiceEnter();

  return userService.isUserLoggedIn()
    ? true
    : router.createUrlTree(['/login']);
};
