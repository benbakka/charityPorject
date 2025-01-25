import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.navigate(['/login']);
      return false;
    }

    const user = JSON.parse(userStr);
    const userRoles: string[] = user.roles || [user.role];

    // Check if user has any of the allowed roles
    const hasAllowedRole = userRoles.some((role: string) => allowedRoles.includes(role));

    if (!hasAllowedRole) {
      // If user is not authorized, redirect based on their role
      if (userRoles.includes('ROLE_USER')) {
        // Only redirect if they're not already going to an allowed page
        const allowedUserPaths = ['/orphans', '/OrphanCards', '/donors'];
        if (!allowedUserPaths.includes(state.url)) {
          router.navigate(['/orphans']);
        }
      } else {
        router.navigate(['/login']);
      }
      return false;
    }

    return true;
  };
};
