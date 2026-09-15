import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, FormsModule],
  template: `
    <div class="checkout-container">
      <h2>Checkout</h2>

      @if (cartService.cartItems().length === 0) {
        <div class="empty-checkout">
          <p>Your cart is empty.</p>
          <a routerLink="/products" class="btn-primary">Browse Products</a>
        </div>
      } @else {
        <div class="checkout-grid">
          <!-- Order Summary -->
          <div class="section-card">
            <h3>Order Summary</h3>
            <ul class="item-list">
              @for (item of cartService.cartItems(); track item.product.id) {
                <li class="item-row">
                  <div class="item-info">
                    <span class="item-name">{{ item.product.name }}</span>
                    <span class="item-qty">Qty: {{ item.quantity }}</span>
                  </div>
                  <span class="item-price">{{ (item.product.price * item.quantity) | currency:'USD' }}</span>
                </li>
              }
            </ul>

            <div class="total-row">
              <span>Total</span>
              <span class="total-amount">{{ cartService.totalPrice() | currency:'USD' }}</span>
            </div>
          </div>

          <!-- Shipping Form -->
          <form class="section-card" (ngSubmit)="processOrder()">
            <h3>Shipping Details</h3>

            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input type="text" id="fullName" [(ngModel)]="shipping.fullName" name="fullName" required />
            </div>

            <div class="form-group">
              <label for="address">Street Address</label>
              <input type="text" id="address" [(ngModel)]="shipping.address" name="address" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input type="text" id="city" [(ngModel)]="shipping.city" name="city" required />
              </div>
              <div class="form-group">
                <label for="zipCode">Zip Code</label>
                <input type="text" id="zipCode" [(ngModel)]="shipping.zipCode" name="zipCode" required />
              </div>
            </div>

            <button type="submit" class="submit-btn">Place Order</button>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-container { max-width: 1000px; margin: 0 auto; padding: 24px 16px; }
    .checkout-container h2 { font-size: 1.875rem; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
    .empty-checkout { text-align: center; padding: 64px; background: #f8fafc; border-radius: 12px; }
    .btn-primary { display: inline-block; margin-top: 12px; background: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; }
    .checkout-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 768px) { .checkout-grid { grid-template-columns: 1fr 1fr; } }
    .section-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    .section-card h3 { font-size: 1.25rem; font-weight: 600; margin-top: 0; margin-bottom: 16px; color: #0f172a; }
    .item-list { list-style: none; padding: 0; margin: 0 0 16px 0; }
    .item-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .item-info { display: flex; flex-direction: column; }
    .item-name { font-weight: 500; color: #1e293b; }
    .item-qty { font-size: 0.8rem; color: #64748b; }
    .item-price { font-weight: 600; color: #0f172a; }
    .total-row { display: flex; justify-content: space-between; font-size: 1.125rem; font-weight: 700; border-top: 2px solid #e2e8f0; padding-top: 12px; }
    .total-amount { color: #059669; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 0.875rem; font-weight: 500; color: #334155; margin-bottom: 6px; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .submit-btn { width: 100%; background: #059669; color: #ffffff; border: none; padding: 12px; font-weight: 600; font-size: 1rem; border-radius: 8px; cursor: pointer; }
    .submit-btn:hover { background: #047857; }
  `]
})
export class CheckoutComponent {
  readonly cartService = inject(CartService);
  private router = inject(Router);

  shipping = {
    fullName: '',
    address: '',
    city: '',
    zipCode: ''
  };

  processOrder(): void {
    alert(`Thank you, ${this.shipping.fullName}! Your order has been placed successfully.`);
    this.cartService.clearCart();
    this.router.navigate(['/products']);
  }
}
