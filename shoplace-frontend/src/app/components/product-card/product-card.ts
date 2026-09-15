import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .product-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .image-container {
      width: 100%;
      height: 180px;
      overflow: hidden;
      border-radius: 6px;
      margin-bottom: 12px;
      background-color: #f7fafc;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder-image {
      color: #a0aec0;
      font-size: 0.9rem;
    }

    .product-card h3 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      color: #1a202c;
    }

    .product-card p {
      margin: 0 0 16px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2b6cb0;
    }

    .actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }

    .btn-primary, .btn-danger {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
      flex: 1;
    }

    .btn-primary {
      background-color: #3182ce;
      color: #ffffff;
    }

    .btn-primary:hover {
      background-color: #2b6cb0;
    }

    .btn-danger {
      background-color: #e53e3e;
      color: #ffffff;
    }

    .btn-danger:hover {
      background-color: #c53030;
    }
  `],
  template: `
    <div class="product-card" (click)="onCardClick()">
      <div class="image-container">
        @if (product().imageUrl) {
          <img
            [src]="product().imageUrl"
            [alt]="product().name"
            class="product-image"
            (error)="onImageError($event)" />
        } @else {
          <div class="placeholder-image">No Image Available</div>
        }
      </div>

      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency }}</p>

      <div class="actions">
        <button
          class="btn-primary"
          (click)="onAddToCart($event)">
          Add to Cart
        </button>

        <button
          class="btn-danger"
          (click)="onDelete($event)">
          Delete Product
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly cardClick = output<Product>();

  private readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);

  onCardClick(): void {
    this.cardClick.emit(this.product());
  }

  onAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    this.cartService.addToCart(this.product());
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();

    // Check both id and _id (in case backend uses MongoDB _id)
    const currentProduct = this.product() as Product & { _id?: string | number };
    const productId = currentProduct.id ?? currentProduct._id;

    if (productId === undefined || productId === null) {
      console.warn('Cannot delete product: Product ID is undefined or missing', this.product());
      alert('Cannot delete: Product ID is missing.');
      return;
    }

    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log(`Product ${productId} deleted successfully.`);
          this.cartService.removeItem(productId);
        },
        error: (err) => {
          console.error('Failed to delete product:', err);
          alert('Failed to delete product from server. Check console/network logs.');
        }
      });
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
  }
}
