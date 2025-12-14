import {
  APP_INITIALIZER,
  ApplicationConfig, inject, provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {tokenInterceptor} from './core/interceptors/token-interceptor/token-interceptor';
import {AuthInitializer} from './core/utility/AuthInitializer';
import {AuthService} from './core/services/auth-service/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(AuthInitializer),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(),withInterceptors([tokenInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      }),
      lang: 'en',
      fallbackLang: 'en'
    }),
    // provideCloudinaryLoader(`https://res.cloudinary.com/${environment.cloudinaryName}/image/upload/`)
  ],
};
