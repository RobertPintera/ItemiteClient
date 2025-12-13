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
import {NotFound} from './components/features/not-found/not-found';
import {UserProducts} from './components/features/user-products/user-products';
import {FollowedProducts} from './components/features/followed-products/followed-products';
import {ConfirmNewEmail} from './components/features/profile-page/edit-email/confirm-new-email/confirm-new-email';
import {ChatsMainWindow} from './components/features/chat/chats-main-window/chats-main-window';

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
        component: ProductsList
      },
      {
        path: 'product',
        component: ProductDetails
      },
      {
        path: 'product-form',
        component: ProductForm,
      },
      {
        path: 'login',
        component: LoginRegister
      },
      {
        path: 'profile',
        component: ProfilePage
      },
      {
        path: 'dev',
        component: Test
      },
      {
        path: 'user-products',
        component: UserProducts
      },
      {
        path: 'followed-products',
        component: FollowedProducts
      },
      {
        path: 'chats',
        component: ChatsMainWindow
      }
    ]
  },
  {
    path: 'confirm-email',
    component: ConfirmEmail
  },
  {
    path: 'change-email',
    component: ConfirmNewEmail
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
