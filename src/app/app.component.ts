import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, CommonModule],
  template: `
    <div class="app-container">
      <app-menu *ngIf="!isAuthPage"></app-menu>
      <main class="main-content" [class.full-width]="isAuthPage">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    .full-width {
      padding: 0;
      width: 100%;
    }
  `]
})
export class AppComponent {
  isAuthPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Hide menu on login and register pages
      this.isAuthPage = ['/login', '/register', ''].includes(event.urlAfterRedirects);
    });
  }
}