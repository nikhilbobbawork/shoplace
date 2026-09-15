import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductDetailModalComponent } from '../product-detail-modal/product-detail-modal';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductDetailModalComponent],
  template: `
    <div class="catalog-container">
      <h2>Products Catalog</h2>

      @if (isLoading()) {
        <div class="loading-state">
          <p>Loading catalog...</p>
        </div>
      } @else if (errorMessage()) {
        <div class="error-banner">
          <p>{{ errorMessage() }}</p>
          <button (click)="loadProducts()" class="btn-retry">Retry</button>
        </div>
      } @else {
        <div class="product-grid">
          @for (product of products(); track product.id) {
            <app-product-card [product]="product" (cardClick)="openModal($event)" />
          } @empty {
            <p class="empty-state">No products found in the catalog.</p>
          }
        </div>
      }

      <app-product-detail-modal
        [product]="selectedProduct()"
        (close)="closeModal()" />
    </div>
  `,
  styles: [`
    .catalog-container { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
    .catalog-container h2 { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
    .loading-state, .empty-state { text-align: center; padding: 48px; color: #64748b; font-size: 1.1rem; }
    .error-banner { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 24px; }
    .btn-retry { margin-top: 12px; background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');
  selectedProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.errorMessage.set('Failed to connect to product server.');
        this.isLoading.set(false);
      }
    });
  }

  openModal(product: Product): void {
    this.selectedProduct.set(product);
  }

  closeModal(): void {
    this.selectedProduct.set(null);
  }
}
