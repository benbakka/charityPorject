import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
     <div class="app-container">
      <div class="sidebar">
        <div class="sidebar-header">
          <i class="pi pi-heart"></i>
          <h1>Faseelah Charity</h1>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <ul class="nav-list">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                  <i class="pi pi-chart-bar"></i>
                  <span>Dashboard</span>
                </a>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <h2 class="nav-title">Management</h2>
            <ul class="nav-list">
              <li class="nav-item">
                <a class="nav-link" routerLink="/orphans" routerLinkActive="active">
                  <i class="pi pi-user"></i>
                  <span>Orphans</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/donors" routerLinkActive="active">
                  <i class="pi pi-heart-fill"></i>
                  <span>Donors</span>
                </a>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <h2 class="nav-title">Projects & Donations</h2>
            <ul class="nav-list">
              <li class="nav-item">
                <a class="nav-link" routerLink="/charity-projects" routerLinkActive="active">
                  <i class="pi pi-box"></i>
                  <span>Charity Projects</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/donations" routerLinkActive="active">
                  <i class="pi pi-dollar"></i>
                  <span>Donations</span>
                </a>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <h2 class="nav-title">Documents</h2>
            <ul class="nav-list">
              <li class="nav-item">
                <a class="nav-link" routerLink="/OrphanCards" routerLinkActive="active">
                  <i class="pi pi-id-card"></i>
                  <span>Orphan Cards</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  `,
  styles: [`
     .app-container {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 280px;
      background: #2c3e50;
      color: white;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-header i {
      font-size: 1.8rem;
      color: #4CAF50;
    }

    .sidebar-header h1 {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
      color: white;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .nav-title {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      padding: 0 0.5rem;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.8rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-link.active {
      background: #4CAF50;
      color: white;
    }

    .nav-link i {
      font-size: 1.2rem;
      width: 1.5rem;
      text-align: center;
    }

    .nav-link span {
      font-size: 0.95rem;
      font-weight: 500;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      background: #f8f9fa;
      overflow-y: auto;
    }
  `]
})
export class MenuComponent {
}
