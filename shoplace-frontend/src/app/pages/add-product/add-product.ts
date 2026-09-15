import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { ProductRequest } from '../../models/product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container">
      <a routerLink="/products" class="back-link">← Back to Catalog</a>

      <div class="form-card">
        <h2>Add New Product</h2>

        @if (errorMessage) {
          <div class="error-banner">
            {{ errorMessage }}
          </div>
        }

        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Product Name *</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              placeholder="e.g. Mechanical Keyboard"
              [class.invalid]="isFieldInvalid('name')"
            />
            @if (isFieldInvalid('name')) {
              <span class="error-msg">Product name is required (min 3 characters).</span>
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Price ($) *</label>
              <input
                id="price"
                type="number"
                step="0.01"
                formControlName="price"
                placeholder="29.99"
                [class.invalid]="isFieldInvalid('price')"
              />
              @if (isFieldInvalid('price')) {
                <span class="error-msg">Enter a valid positive price.</span>
              }
            </div>

            <div class="form-group">
              <label for="stockQuantity">Stock Quantity *</label>
              <input
                id="stockQuantity"
                type="number"
                formControlName="stockQuantity"
                placeholder="10"
                [class.invalid]="isFieldInvalid('stockQuantity')"
              />
              @if (isFieldInvalid('stockQuantity')) {
                <span class="error-msg">Stock quantity must be 0 or greater.</span>
              }
            </div>
          </div>

          <div class="form-group">
            <label for="category">Category *</label>
            <select
              id="category"
              formControlName="category"
              [class.invalid]="isFieldInvalid('category')"
            >
              <option value="" disabled>Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
            </select>
            @if (isFieldInvalid('category')) {
              <span class="error-msg">Category selection is required.</span>
            }
          </div>

          <div class="form-group">
            <label for="imageUrl">Image URL *</label>
            <input
              id="imageUrl"
              type="url"
              formControlName="imageUrl"
              placeholder="https://images.unsplash.com/..."
              [class.invalid]="isFieldInvalid('imageUrl')"
            />
            @if (isFieldInvalid('imageUrl')) {
              <span class="error-msg">Valid image URL is required.</span>
            }
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              rows="4"
              formControlName="description"
              placeholder="Provide key features and details..."
              [class.invalid]="isFieldInvalid('description')"
            ></textarea>
            @if (isFieldInvalid('description')) {
              <span class="error-msg">Description must be at least 10 characters.</span>
            }
          </div>

          <div class="form-actions">
            <button type="button" routerLink="/products" class="btn-cancel">Cancel</button>
            <button type="submit" [disabled]="productForm.invalid || isSubmitting" class="btn-submit">
              {{ isSubmitting ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container { max-width: 680px; margin: 0 auto; padding: 24px 16px; }
    .back-link { display: inline-block; color: #2563eb; text-decoration: none; font-weight: 500; margin-bottom: 16px; }
    .form-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .form-card h2 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 24px; }
    .error-banner { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 6px; padding: 12px; margin-bottom: 20px; font-size: 0.875rem; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 0.875rem; font-weight: 600; color: #334155; margin-bottom: 6px; }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.95rem; box-sizing: border-box; outline: none; transition: border-color 0.15s;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #2563eb; }
    .form-group input.invalid, .form-group select.invalid, .form-group textarea.invalid { border-color: #ef4444; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .error-msg { font-size: 0.75rem; color: #ef4444; margin-top: 4px; display: block; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 28px; }
    .btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; text-decoration: none; }
    .btn-submit { background: #2563eb; color: #ffffff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .btn-submit:disabled { background: #94a3b8; cursor: not-allowed; }
  `]
})
export class AddProductComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  isSubmitting = false;
  errorMessage = '';

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [10, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload: ProductRequest = {
      name: this.productForm.value.name!,
      price: Number(this.productForm.value.price),
      stockQuantity: Number(this.productForm.value.stockQuantity),
      category: this.productForm.value.category!,
      imageUrl: this.productForm.value.imageUrl!,
      description: this.productForm.value.description!
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create product. Please verify backend server connection.';
        console.error('Error creating product:', err);
      }
    });
  }
}
