import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { firstValueFrom } from 'rxjs';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    console.log('Role Guard - Checking route:', state.url);
    console.log('Role Guard - Allowed roles:', allowedRoles);

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('Role Guard - No user found in localStorage');
      router.navigate(['/login']);
      return false;
    }

    try {
      const user = JSON.parse(userStr);
      console.log('Role Guard - User:', user);
      
      const userRoles: string[] = user.roles || [user.role];
      console.log('Role Guard - User roles:', userRoles);

      // Check if user has any of the allowed roles
      const hasAllowedRole = userRoles.some((role: string) => allowedRoles.includes(role));
      console.log('Role Guard - Has allowed role:', hasAllowedRole);

      if (!hasAllowedRole) {
        console.log('Role Guard - User does not have required role');
        router.navigate(['/login']);
        return false;
      }

      // For admin users, allow all access
      if (userRoles.includes('ROLE_ADMIN')) {
        console.log('Role Guard - Admin user, granting access');
        return true;
      }

      // For non-admin users, check specific route permissions
      const permissions = await firstValueFrom(permissionService.getUserPermissions(user.id));
      console.log('Role Guard - User permissions:', permissions);

      // First find a default route the user has access to
      const defaultRoute = permissions.find(p => p.canAccess)?.route || '/login';

      // Get the base route without parameters
      const baseRoute = '/' + state.url.split('/')[1];
      console.log('Role Guard - Checking base route:', baseRoute);

      const hasPermission = permissions.some(p => {
        const permissionMatches = p.route === baseRoute && p.canAccess;
        console.log('Role Guard - Checking permission:', p.route, 'against', baseRoute, '- Has access:', p.canAccess);
        return permissionMatches;
      });

      console.log('Role Guard - Has permission:', hasPermission);

      if (!hasPermission) {
        console.log('Role Guard - No permission for route, redirecting to:', defaultRoute);
        router.navigate([defaultRoute]);
        return false;
      }

      console.log('Role Guard - Access granted');
      return true;
    } catch (error) {
      console.error('Role Guard - Error:', error);
      router.navigate(['/login']);
      return false;
    }
  };
};
