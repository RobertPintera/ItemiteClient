import { Routes } from '@angular/router';
import { MainLayout } from './components/layouts/main-layout/main-layout';
import { Home } from './components/features/home/home';
import { Login } from './components/features/login/login';
import {ProductsList} from './components/features/products-list/products-list';
import {ProductDetails} from './components/features/product-details/product-details';

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
        path: 'login',
        component: Login,
      }
    ]
  }
];
