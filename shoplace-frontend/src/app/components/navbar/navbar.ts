import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart'; // Adjust path as needed

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'] // or your component styles
})
export class NavbarComponent {
  readonly cartService = inject(CartService);
  private router = inject(Router);

  navigateToCheckout(): void {
    this.router.navigate(['/cart']); // Adjust route if your checkout/cart path is different
  }
}
