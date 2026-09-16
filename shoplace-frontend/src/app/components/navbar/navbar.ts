import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { SearchService } from '../../services/search';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  readonly cartService = inject(CartService);
  private searchService = inject(SearchService);
  private router = inject(Router);

  searchInputValue = '';

  onInputChange(): void {
    this.searchService.setSearchQuery(this.searchInputValue);
  }

  clearInput(): void {
    this.searchInputValue = '';
    this.searchService.clearSearch();
  }

  navigateToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
