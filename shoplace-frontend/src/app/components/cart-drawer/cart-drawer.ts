import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="drawer">
      <div class="header">
        <h2>Your Cart ({{ cartService.totalCount() }})</h2>
      </div>

      <div class="items">
        @for (item of cartService.cartItems(); track item.product.id) {
          <div class="cart-item">
            <div class="info">
              <h4>{{ item.product.name }}</h4>
              <p>{{ item.product.price | currency }}</p>
            </div>

            <div class="quantity-controls">
              <button (click)="cartService.updateQuantity(item.product.id, -1)">-</button>
              <span>{{ item.quantity }}</span>
              <button (click)="cartService.updateQuantity(item.product.id, 1)">+</button>
            </div>

            <button class="remove-btn" (click)="cartService.removeItem(item.product.id)">
              Remove
            </button>
          </div>
        } @empty {
          <p>Your cart is empty.</p>
        }
      </div>

      <div class="footer">
        <p>Total: {{ cartService.totalPrice() | currency }}</p>
      </div>
    </div>
  `
})
export class CartDrawerComponent {
  readonly cartService = inject(CartService);
}
