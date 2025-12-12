import { Routes } from '@angular/router';
import { MainLayout } from './components/layouts/main-layout/main-layout';
import { Home } from './components/features/home/home';
import {LoginRegister} from './components/features/login-register/login-register';
import {ProductsList} from './components/features/products-list/products-list';
import {ProductDetails} from './components/features/product-details/product-details';
import {ProfilePage} from './components/features/profile-page/profile-page';
import {Chat} from './components/features/chat/chat/chat';
import {Test} from './components/features/test/test';
import {ConfirmEmail} from './components/features/login-register/confirm-email/confirm-email';
import {ResetPassword} from './components/features/login-register/reset-password/reset-password';
import {ExternalLoginError} from './components/features/login-register/external-login-error/external-login-error';
import {Me} from './components/features/login-register/me/me';
import {ProductForm} from './components/features/product-form/product-form';
import {NotFound} from './components/features/not-found/not-found';
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
