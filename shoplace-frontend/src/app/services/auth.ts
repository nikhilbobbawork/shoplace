import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/auth';

  // Signal to track login state reactively across components
  isLoggedIn = signal<boolean>(this.checkInitialAuthStatus());

  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Example login method (if you add login later)
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Assuming your backend returns a token or user session info
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          this.isLoggedIn.set(true);
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Clear token/session storage
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']); // Redirect to login page
  }

  private checkInitialAuthStatus(): boolean {
    // Check if token exists in localStorage on app load
    return !!localStorage.getItem('authToken');
  }

  loginWithGithub(): void {
    // Triggers Spring Boot's automatic OAuth2 redirect to GitHub
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  }
}
