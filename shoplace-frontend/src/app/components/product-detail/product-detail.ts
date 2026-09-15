import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  template: `
    <div class="page-container">
      <a routerLink="/products" class="back-link">← Back to Products</a>

      @if (isLoading) {
        <div class="status-card">Loading product details...</div>
      }

      @if (errorMessage && !isLoading) {
        <div class="status-card error">
          <p>{{ errorMessage }}</p>
          <a routerLink="/products" class="btn-primary">Return to Catalog</a>
        </div>
      }

      @if (product(); as item) {
        <div class="product-detail-card">
          <div class="image-wrapper">
            <img [src]="item.imageUrl" [alt]="item.name" />
          </div>

          <div class="details-body">
            <span class="category-tag">{{ item.category }}</span>
            <h1 class="title">{{ item.name }}</h1>
            <p class="price">{{ item.price | currency:'USD' }}</p>
            <p class="description">{{ item.description }}</p>

            <div class="actions">
              <button class="add-cart-btn" (click)="addToCart(item)">
                🛒 Add to Cart
              </button>

              <button class="delete-btn" (click)="deleteProduct(item.id)">
                🗑️ Delete Product
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 1000px; margin: 0 auto; padding: 24px 16px; }
    .back-link { display: inline-block; color: #2563eb; text-decoration: none; font-weight: 500; margin-bottom: 20px; }
    .back-link:hover { text-decoration: underline; }
    .status-card { text-align: center; padding: 48px; background: #f8fafc; border-radius: 12px; color: #475569; }
    .status-card.error { color: #dc2626; background: #fef2f2; }
    .btn-primary { display: inline-block; margin-top: 12px; padding: 8px 16px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; }
    .product-detail-card { display: grid; grid-template-columns: 1fr; gap: 32px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    @media (min-width: 768px) { .product-detail-card { grid-template-columns: 1fr 1fr; } }
    .image-wrapper img { width: 100%; height: 380px; object-fit: cover; border-radius: 8px; }
    .category-tag { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #2563eb; background: #eff6ff; padding: 4px 8px; border-radius: 4px; }
    .title { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 12px 0; }
    .price { font-size: 1.5rem; font-weight: 700; color: #059669; margin-bottom: 16px; }
    .description { color: #475569; line-height: 1.6; margin-bottom: 24px; }
    .actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .add-cart-btn { background: #2563eb; color: #ffffff; border: none; padding: 12px 24px; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
    .add-cart-btn:hover { background: #1d4ed8; }
    .delete-btn { background: #dc2626; color: #ffffff; border: none; padding: 12px 24px; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
    .delete-btn:hover { background: #b91c1c; }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product.set(data);
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Product not found.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Invalid product ID.';
      this.isLoading = false;
    }
  }

  addToCart(item: Product): void {
    this.cartService.addToCart(item);
  }

  deleteProduct(id: number | string | undefined): void {
    if (id === undefined) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.cartService.removeItem(id);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Failed to delete product', err);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }
}
