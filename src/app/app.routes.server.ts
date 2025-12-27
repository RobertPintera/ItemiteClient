import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender }, // Home
  { path: 'products', renderMode: RenderMode.Prerender },
  { path: 'product', renderMode: RenderMode.Prerender },

  { path: 'login', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },
  { path: 'product-form', renderMode: RenderMode.Client },
  { path: 'user-products', renderMode: RenderMode.Client },
  { path: 'followed-products', renderMode: RenderMode.Client },
  { path: 'chats', renderMode: RenderMode.Client },
  { path: 'purchases', renderMode: RenderMode.Client },
  { path: 'sales', renderMode: RenderMode.Client },
  { path: 'payment', renderMode: RenderMode.Client },
  { path: 'payment-success', renderMode: RenderMode.Client },
  { path: 'change-email', renderMode: RenderMode.Client },
  { path: 'confirm-email', renderMode: RenderMode.Client },
  { path: 'reset-password', renderMode: RenderMode.Client },
  { path: 'external-login-error', renderMode: RenderMode.Client },
  { path: 'me', renderMode: RenderMode.Client },

  { path: '**', renderMode: RenderMode.Prerender }
];
