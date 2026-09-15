import { Routes } from '@angular/router';
import { checkoutGuard } from './guards/checkout/checkout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list').then(m => m.ProductListComponent)
  },
  {
    path: 'products/add',
    loadComponent: () =>
      import('./pages/add-product/add-product').then(m => m.AddProductComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent)
  },
  {
    path: 'checkout',
    canActivate: [checkoutGuard],
    loadComponent: () =>
      import('./pages/checkout/checkout').then(m => m.CheckoutComponent)
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
