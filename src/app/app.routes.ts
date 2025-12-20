import { Routes } from '@angular/router';
import { MainLayout } from './components/layouts/main-layout/main-layout';
import { Home } from './components/features/home/home';
import {LoginRegister} from './components/features/login-register/login-register';
import {ProductsList} from './components/features/products-list/products-list';
import {ProductDetails} from './components/features/product-details/product-details';
import {ProfilePage} from './components/features/profile-page/profile-page';
import {Test} from './components/features/test/test';
import {ConfirmEmail} from './components/features/login-register/confirm-email/confirm-email';
import {ResetPassword} from './components/features/login-register/reset-password/reset-password';
import {ExternalLoginError} from './components/features/login-register/external-login-error/external-login-error';
import {Me} from './components/features/login-register/me/me';
import {ProductForm} from './components/features/product-form/product-form';
import {UserProducts} from './components/features/user-products/user-products';
import {FollowedProducts} from './components/features/followed-products/followed-products';
import {ConfirmNewEmail} from './components/features/profile-page/edit-email/confirm-new-email/confirm-new-email';
import {ChatsMainWindow} from './components/features/chat/chats-main-window/chats-main-window';
import {GuestGuard} from './core/guards/guest-guard/guest-guard';
import {AuthGuard} from './core/guards/auth-guard/auth-guard';

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
        path: 'products',
        loadComponent: () =>
          import('./components/features/products-list/products-list')
            .then((m)=>m.ProductsList)
      },
      {
        path: 'product',
        loadComponent: () =>
          import('./components/features/product-details/product-details')
            .then((m) => m.ProductDetails)
      },
      {
        path: 'product-form',
        loadComponent: () =>
          import('./components/features/product-form/product-form')
            .then(m => m.ProductForm),
        canActivate: [AuthGuard],
      },
      {
        path: 'login',
        canActivate: [GuestGuard],
        loadComponent: () =>
          import('./components/features/login-register/login-register')
            .then(m => m.LoginRegister),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/features/profile-page/profile-page')
            .then(m => m.ProfilePage),
        canActivate: [AuthGuard]
      },
      {
        path: 'dev',
        component: Test
      },
      {
        path: 'user-products',
        loadComponent: () =>
          import('./components/features/user-products/user-products')
            .then(m => m.UserProducts),
        canActivate: [AuthGuard],
      },
      {
        path: 'followed-products',
        loadComponent: () =>
          import('./components/features/followed-products/followed-products')
            .then(m => m.FollowedProducts),
        canActivate: [AuthGuard],
      },
      {
        path: 'chats',
        loadComponent: () =>
          import('./components/features/chat/chats-main-window/chats-main-window')
            .then(m => m.ChatsMainWindow),
        canActivate: [AuthGuard],
      },
      {
        path: 'purchases',
        loadComponent: () =>
          import('./components/features/purchases/purchases')
            .then(m => m.Purchases),
        canActivate: [AuthGuard],
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./components/features/sales/sales')
            .then(m => m.Sales),
        canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: 'confirm-email',
    loadComponent: () =>
      import('./components/features/login-register/confirm-email/confirm-email')
        .then(m => m.ConfirmEmail),
  },
  {
    path: 'change-email',
    loadComponent: () =>
      import('./components/features/profile-page/edit-email/confirm-new-email/confirm-new-email')
        .then(m=>m.ConfirmNewEmail),
    canActivate: [AuthGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/features/login-register/reset-password/reset-password')
        .then(m => m.ResetPassword),
  },
  {
    path: 'external-login-error',
    loadComponent: () =>
      import('./components/features/login-register/external-login-error/external-login-error')
        .then(m => m.ExternalLoginError),
  },
  {
    path: 'me',
    loadComponent: () =>
      import('./components/features/login-register/me/me')
        .then((m) => m.Me),
  }
];
