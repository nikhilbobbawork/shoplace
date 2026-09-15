import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  /**
   * Signal holding current search text
   */
  readonly searchQuery = signal<string>('');

  /**
   * Update the global search query
   */
  setSearchQuery(query: string): void {
    this.searchQuery.set(query.trim().toLowerCase());
  }

  /**
   * Clear active search query
   */
  clearSearch(): void {
    this.searchQuery.set('');
  }
}
