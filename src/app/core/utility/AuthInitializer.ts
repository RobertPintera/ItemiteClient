import {AuthService} from '../services/auth-service/auth.service';
import {inject} from '@angular/core';

export function AuthInitializer() {
  const auth = inject(AuthService);
  return auth.ResolveAuth();
}
