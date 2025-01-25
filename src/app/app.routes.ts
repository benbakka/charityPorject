import { Routes } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { OrphanIDCardComponent } from './orphan/orphan.component';
import { OrphanCardsComponent } from './orphan-cards/orphan-cards.component';
import { DonorComponent } from './donor/donor.component';
import { CharityProjectComponent } from './charity-project/charity-project.component';
import { DonationComponent } from './donation/donation.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadDonorsComponent } from './components/upload/uploadDonors.component';
import { UsersComponent } from './components/user-management/users.component';
import { UploadDonationsComponent } from './components/upload/uploadDonations.component';
import { UploadCharityProjectComponent } from './components/upload/uploadCharityProject.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  { 
    path: 'upload', 
    component: UploadComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN', 'ROLE_USER'])]
  },
  { 
    path: 'upload-donors', 
    component: UploadDonorsComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN', 'ROLE_USER'])]
  },
  { 
    path: 'upload-donations', 
    component: UploadDonationsComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  { 
    path: 'upload-charity-projects', 
    component: UploadCharityProjectComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  { 
    path: 'orphans', 
    component: OrphanIDCardComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN', 'ROLE_USER'])]
  },
  { 
    path: 'OrphanCards', 
    component: OrphanCardsComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN', 'ROLE_USER'])]
  },
  { 
    path: 'donors', 
    component: DonorComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN', 'ROLE_USER'])]
  },
  { 
    path: 'donors/:id/history',
    loadComponent: () => import('./donor/donation-history/donation-history.component')
      .then(m => m.DonationHistoryComponent)
  },
  { 
    path: 'charity-projects', 
    component: CharityProjectComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  { 
    path: 'donations', 
    component: DonationComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  { 
    path: 'users', 
    component: UsersComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  // Catch all route - redirect to login
  {
    path: '**',
    redirectTo: '/login'
  }
];