import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product, ProductRequest } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/products';
  readonly products = signal<Product[]>([]);
  /**
   * Fetch all products or filter by category
   */
  getProducts(category?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  /**
   * Fetch a single product by ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new product (Admin / Seller)
   */
  createProduct(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Update an existing product
   */
  updateProduct(id: number, product: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Delete a product
   */
  deleteProduct(productId: number | string): Observable<void> {
    return this.http.delete<void>(`/api/products/${productId}`).pipe(
      tap(() => {
        this.products.update(items => items.filter(p => p.id !== productId));
      })
    );
  }
}
