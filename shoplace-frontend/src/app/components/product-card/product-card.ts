import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      (click)="onCardClick()"
      class="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
    >
      <!-- Image Frame -->
      <div class="relative flex h-52 w-full items-center justify-center overflow-hidden bg-slate-50">
        @if (product().category) {
          <span class="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-md">
            {{ product().category }}
          </span>
        }

        @if (product().imageUrl) {
          <img
            [src]="product().imageUrl"
            [alt]="product().name"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            (error)="onImageError($event)"
          />
        } @else {
          <div class="flex flex-col items-center gap-1 text-[13px] font-medium text-slate-400">
            <svg class="h-8 w-8 stroke-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>No Image</span>
          </div>
        }
      </div>

      <!-- Details -->
      <div class="flex flex-1 flex-col p-4">
        <h3 class="line-clamp-2 text-base font-semibold text-slate-900 leading-snug">
          {{ product().name }}
        </h3>

        <p class="mt-1 text-lg font-bold text-blue-600">
          {{ product().price | currency }}
        </p>

        <!-- Actions -->
        <div class="mt-auto flex items-center gap-2 pt-3">
          <button
            type="button"
            (click)="onAddToCart($event)"
            class="flex flex-2 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/20 active:scale-95"
          >
            <svg class="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Add
          </button>

          <button
            type="button"
            (click)="onDelete($event)"
            title="Delete Product"
            class="flex items-center justify-center rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-500 transition-all hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-500/20 active:scale-95"
          >
            <svg class="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly cardClick = output<Product>();
  readonly productDeleted = output<number>();

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

    const currentProduct = this.product() as Product & { _id?: number };
    const productId = currentProduct.id ?? currentProduct._id;

    if (productId === undefined || productId === null) return;

    if (confirm(`Are you sure you want to delete "${this.product().name}"?`)) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.cartService.removeItem(productId);
          this.productDeleted.emit(productId);
        },
        error: (err) => console.error('Failed to delete product', err)
      });
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
  }
}
