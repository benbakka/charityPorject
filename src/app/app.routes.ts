import { Routes } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { OrphanIDCardComponent } from './orphan/orphan.component';
import { OrphanCardsComponent } from './orphan-cards/orphan-cards.component';
import { DonorComponent } from './donor/donor.component';
import { CharityProjectComponent } from './charity-project/charity-project.component';
import { DonationComponent } from './donation/donation.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      
      if (authService.isLoggedIn() && authService.hasAdminRole()) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }]
  },
  {
    path: '',
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      
      if (authService.isLoggedIn() && authService.hasAdminRole()) {
        router.navigate(['/dashboard']);
        return false;
      }
      router.navigate(['/login']);
      return false;
    }],
    component: LoginComponent
  },
  { path: 'upload', component: UploadComponent, canActivate: [authGuard] },
  { path: 'orphans', component: OrphanIDCardComponent, canActivate: [authGuard] },
  { path: 'OrphanCards', component: OrphanCardsComponent, canActivate: [authGuard] },
  { path: 'donors', component: DonorComponent, canActivate: [authGuard] },
  { path: 'charity-projects', component: CharityProjectComponent, canActivate: [authGuard] },
  { path: 'donations', component: DonationComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
];