import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
          <div class="nav-section" *ngIf="isAdmin">
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
            <li class="nav-item" *ngIf="isAdmin">
                <a class="nav-link" routerLink="/users" routerLinkActive="active">
                  <i class="pi pi-users"></i>
                  <span>Users</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/orphans" routerLinkActive="active">
                  <i class="pi pi-user"></i>
                  <span>Orphans</span>
                </a>
              </li>
             <li class="nav-item">
                <a class="nav-link" routerLink="/OrphanCards" routerLinkActive="active">
                  <i class="pi pi-id-card"></i>
                  <span>Orphan Cards</span>
                </a>
              </li>
            </ul>
          </div>

         

          <div class="nav-section" *ngIf="isAdmin">
            <h2 class="nav-title">Projects & Donations</h2>
            <ul class="nav-list">
             <li class="nav-item">
                <a class="nav-link" routerLink="/donors" routerLinkActive="active">
                  <i class="pi pi-heart-fill"></i>
                  <span>Donors</span>
                </a>
              </li>
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
            <h2 class="nav-title">Upload</h2>
            <ul class="nav-list">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" (click)="toggleUploadDropdown()">
                  <i class="pi pi-upload"></i>
                  <span>Uploads</span>
                </a>
                <ul class="dropdown-menu" [class.show]="isUploadDropdownOpen">
                  <li>
                    <a class="dropdown-item" routerLink="/upload" routerLinkActive="active" (click)="closeUploadDropdown()">
                      <i class="pi pi-users"></i>
                      <span>Upload Orphans</span>
                    </a>
                  </li>
                  <li >
                    <a class="dropdown-item" routerLink="/upload-donors" routerLinkActive="active" (click)="closeUploadDropdown()">
                      <i class="pi pi-user"></i>
                      <span>Upload Donors</span>
                    </a>
                  </li>
                  <li >
                    <a class="dropdown-item" routerLink="/upload-donations" routerLinkActive="active" (click)="closeUploadDropdown()">
                      <i class="pi pi-dollar"></i>
                      <span>Upload Donations</span>
                    </a>
                  </li>
                  <li >
                    <a class="dropdown-item" routerLink="/upload-charity-projects" routerLinkActive="active" (click)="closeUploadDropdown()">
                      <i class="pi pi-box"></i>
                      <span>Upload Charity Projects</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div class="nav-section logout-section">
            <ul class="nav-list">
              <li class="nav-item">
                <a class="nav-link logout-link" (click)="logout()">
                  <i class="pi pi-sign-out"></i>
                  <span>Logout</span>
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
      height: 100vh;
      background: #2c3e50;
      color: white;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      margin-bottom: 1rem;
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
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow-y: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
    }

    .sidebar-nav::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }

    .nav-section {
      margin-bottom: 1rem;
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
      cursor: pointer;
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

    .logout-section {
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1rem;
    }

    .logout-link {
      color: #ff6b6b;
    }

    .logout-link:hover {
      background: rgba(255, 99, 99, 0.1);
    }

    .dropdown-menu {
      display: none;
      position: absolute;
      background-color: #2c3e50;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }

    .dropdown-menu.show {
      display: block;
    }

    .dropdown-item {
      padding: 0.8rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      display: block;
    }

    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .dropdown-item i {
      font-size: 1.2rem;
      width: 1.5rem;
      text-align: center;
    }

    .dropdown-item span {
      font-size: 0.95rem;
      font-weight: 500;
    }
  `]
})
export class MenuComponent {
  isUploadDropdownOpen = false;

  constructor(private authService: AuthService) { }

  get isAdmin(): boolean {
    return this.authService.hasAdminRole();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleUploadDropdown(): void {
    this.isUploadDropdownOpen = !this.isUploadDropdownOpen;
  }

  closeUploadDropdown(): void {
    this.isUploadDropdownOpen = false;
  }
}
