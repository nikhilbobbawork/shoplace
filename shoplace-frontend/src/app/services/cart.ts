import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'shoplace_cart_items';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Initialize signal state from localStorage
  readonly cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  readonly totalCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalItems = computed(() => this.totalCount());

  readonly totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0)
  );

  readonly total = computed(() => this.totalPrice());

  constructor() {
    // Automatically runs whenever cartItems signal updates
    effect(() => {
      this.saveCartToStorage(this.cartItems());
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    if (!product || product.id === undefined) return;

    this.cartItems.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...items, { product, quantity }];
    });
  }

  updateQuantity(productId: number | string | undefined, delta: number): void {
    if (productId === undefined) return;

    this.cartItems.update(items =>
      items
        .map(item => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }

  removeItem(productId: number | string | undefined): void {
    if (productId === undefined) return;
    this.cartItems.update(items => items.filter(i => i.product.id !== productId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  // --- LocalStorage Helpers ---

  private loadCartFromStorage(): CartItem[] {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to parse cart items from localStorage', e);
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart items to localStorage', e);
    }
  }
}
