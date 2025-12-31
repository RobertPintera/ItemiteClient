import { Routes } from '@angular/router';
import { MainLayout } from './components/layouts/main-layout/main-layout';
import { Home } from './components/features/home/home';
import {Test} from './components/features/test/test';
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
      {
        path: 'payment',
        loadComponent: () =>
          import('./components/features/payment/payment')
            .then(m => m.Payment),
        canActivate: [AuthGuard],
      },
      {
        path: 'payment-success',
        loadComponent: () =>
          import('./components/features/payment-success/payment-success')
            .then(m => m.PaymentSuccess),
        canActivate: [AuthGuard],
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./components/features/chat/fullscreen-chat-page/fullscreen-chat-page')
            .then(m => m.FullscreenChatPage),
        canActivate: [AuthGuard],
      },
      {
        path: 'report',
        loadComponent: () =>
          import('./components/features/report-form/report-form')
            .then(m => m.ReportForm),
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
