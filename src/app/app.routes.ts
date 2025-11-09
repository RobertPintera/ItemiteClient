import { Routes } from '@angular/router';
import { MainLayout } from './components/layouts/main-layout/main-layout';
import { Home } from './components/features/home/home';
import {LoginRegister} from './components/features/login-register/login-register';
import {ProductsList} from './components/features/products-list/products-list';
import {ProductDetails} from './components/features/product-details/product-details';
import {ProfilePage} from './components/features/profile-page/profile-page';
import {Chat} from './components/features/chat/chat';

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
        path: 'dev',
        component: Chat
      }

    ]
  }
];
