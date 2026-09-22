import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth'; // Adjust path as needed

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private router = inject(Router);

  navigateToCheckout(): void {
    this.router.navigate(['/cart']);
  }
}
