import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../../services/cart';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);

  // Allow navigation if the cart has items
  if (cartService.cartItems().length > 0) {
    return true;
  }

  // Redirect to product catalog if cart is empty
  return router.createUrlTree(['/products']);
};
