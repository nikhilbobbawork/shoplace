export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stockQuantity: number;
  createdAt?: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stockQuantity: number;
}
