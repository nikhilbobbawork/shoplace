import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-layout">
      <app-navbar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; flex-direction: column; min-height: 100vh; background-color: #f8fafc; }
    .main-content { flex: 1; }
  `]
})
export class AppComponent {
  title = 'Shoplace';
}
