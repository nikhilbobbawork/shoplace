import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { SearchService } from '../../services/search';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  template: `
    <header class="navbar-header">
      <div class="navbar-container">
        <!-- Logo / Brand -->
        <a class="brand-logo" href="#">
          <span class="brand-icon">🛍️</span>
          <span class="brand-name">Shoplace</span>
        </a>

        <!-- Live Search Input -->
        <div class="search-container">
          <input
            type="text"
            placeholder="Search products by name or category..."
            [(ngModel)]="searchInputValue"
            (input)="onInputChange()"
          />
          @if (searchInputValue) {
            <button class="clear-search-btn" (click)="clearInput()" aria-label="Clear search">✕</button>
          } @else {
            <span class="search-icon">🔍</span>
          }
        </div>

        <!-- Right Side Actions -->
        <div class="nav-actions">
          <button class="cart-btn" (click)="cartService.totalCount()" aria-label="Shopping Cart">
            <span class="cart-icon">🛒</span>
            <span class="cart-label">Cart</span>

            @if (cartService.totalCount() > 0) {
              <span class="cart-badge">{{ cartService.totalCount() }}</span>
            }
          </button>

          @if (cartService.totalCount() > 0) {
            <span class="cart-total">{{ cartService.totalPrice() | currency:'USD' }}</span>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-header { background-color: #0f172a; color: #ffffff; position: sticky; top: 0; z-index: 50; }
    .navbar-container { max-width: 1200px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .brand-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: #ffffff; }
    .brand-name { font-size: 1.25rem; font-weight: 700; }
    .search-container { flex: 1; max-width: 480px; display: flex; align-items: center; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 0 12px; }
    .search-container input { width: 100%; background: transparent; border: none; padding: 8px 0; color: #ffffff; font-size: 0.875rem; outline: none; }
    .search-container input::placeholder { color: #94a3b8; }
    .search-icon, .clear-search-btn { color: #94a3b8; font-size: 0.875rem; background: none; border: none; cursor: pointer; }
    .nav-actions { display: flex; align-items: center; gap: 16px; }
    .cart-btn { position: relative; display: flex; align-items: center; gap: 6px; background: #2563eb; color: #ffffff; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; }
    .cart-badge { position: absolute; top: -6px; right: -6px; background-color: #ef4444; color: #ffffff; font-size: 0.75rem; font-weight: 700; height: 20px; min-width: 20px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 2px solid #0f172a; }
    .cart-total { font-size: 0.875rem; font-weight: 600; color: #38bdf8; }
  `]
})
export class NavbarComponent {
  readonly cartService = inject(CartService);
  private searchService = inject(SearchService);

  searchInputValue = '';

  onInputChange(): void {
    this.searchService.setSearchQuery(this.searchInputValue);
  }

  clearInput(): void {
    this.searchInputValue = '';
    this.searchService.clearSearch();
  }
}
