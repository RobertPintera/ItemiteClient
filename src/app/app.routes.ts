import { Routes } from '@angular/router';
import { MainLayout } from './components/layouts/main-layout/main-layout';
import { Home } from './components/features/home/home';
import {LoginRegister} from './components/features/login-register/login-register';
import {ProductsList} from './components/features/products-list/products-list';
import {ProductDetails} from './components/features/product-details/product-details';
import {ProfilePage} from './components/features/profile-page/profile-page';
import {ConfirmEmail} from './components/features/login-register/confirm-email/confirm-email';
import {ResetPassword} from './components/features/login-register/reset-password/reset-password';
import {ExternalLoginError} from './components/features/login-register/external-login-error/external-login-error';
import {Me} from './components/features/login-register/me/me';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'products/:category',
        component: ProductsList
      },
      {
        path: 'products/:category/:slug',
        component: ProductDetails
      },
      {
        path: 'login',
        component: LoginRegister
      },
      {
        path: 'profile',
        component: ProfilePage
      }
    ]
  },
  {
    path: 'confirm-email',
    component: ConfirmEmail
  },
  {
    path: 'reset-password',
    component: ResetPassword
  },
  {
    path: 'external-login-error',
    component: ExternalLoginError
  },
  {
    path: 'me',
    component: Me
  }
];
