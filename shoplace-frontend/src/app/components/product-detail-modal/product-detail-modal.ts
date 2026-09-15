import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (product) {
      <div class="modal-backdrop" (click)="close.emit()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="close.emit()" aria-label="Close modal">&times;</button>

          <div class="modal-body">
            <div class="image-wrapper">
              <img [src]="product.imageUrl" [alt]="product.name" (error)="onImageError($event)" />
            </div>

            <div class="details-wrapper">
              <span class="category-badge">{{ product.category }}</span>
              <h2 class="product-title">{{ product.name }}</h2>
              <p class="product-price">\${{ product.price.toFixed(2) }}</p>

              <div class="description-section">
                <h3>Description</h3>
                <p>{{ product.description }}</p>
              </div>

              <div class="meta-info">
                <span class="stock-status" [class.in-stock]="product.stockQuantity > 0" [class.out-of-stock]="product.stockQuantity === 0">
                  {{ product.stockQuantity > 0 ? 'In Stock (' + product.stockQuantity + ' available)' : 'Out of Stock' }}
                </span>
              </div>

              <div class="actions">
                <button
                  class="btn-add-cart"
                  [disabled]="product.stockQuantity === 0"
                  (click)="handleAddToCart()">
                  {{ added() ? 'Added to Cart!' : 'Add to Cart' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;
    }
    .modal-content {
      background: #ffffff; border-radius: 12px; max-width: 750px; width: 100%;
      position: relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden;
    }
    .close-btn {
      position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none;
      font-size: 1.5rem; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; color: #64748b;
    }
    .modal-body { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 32px; }
    .image-wrapper img { width: 100%; height: 280px; object-fit: cover; border-radius: 8px; }
    .category-badge { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #2563eb; background: #eff6ff; padding: 4px 8px; border-radius: 4px; }
    .product-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 4px 0 8px; }
    .product-price { font-size: 1.35rem; font-weight: 800; color: #059669; margin-bottom: 16px; }
    .description-section p { font-size: 0.95rem; color: #334155; line-height: 1.5; margin-bottom: 16px; }
    .stock-status { font-size: 0.85rem; font-weight: 600; padding: 4px 10px; border-radius: 12px; }
    .in-stock { background: #dcfce7; color: #15803d; }
    .out-of-stock { background: #fee2e2; color: #b91c1c; }
    .btn-add-cart {
      width: 100%; background: #2563eb; color: white; border: none; padding: 12px;
      border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background 0.2s;
    }
    .btn-add-cart:hover:not(:disabled) { background: #1d4ed8; }
    .btn-add-cart:disabled { background: #94a3b8; cursor: not-allowed; }
  `]
})
export class ProductDetailModalComponent {
  private cartService = inject(CartService);

  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();

  added = signal(false);

  handleAddToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.added.set(true);
      setTimeout(() => this.added.set(false), 1500);
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
  }
}
