import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'];
    
    if (requiredRole && currentUser.role !== requiredRole) {
      alert('Access denied: You do not have permission to access this page.');
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }

  isAdmin(): boolean {
    const currentUser = this.authService.currentUserValue;
    return currentUser?.role === 'Admin';
  }

  isUser(): boolean {
    const currentUser = this.authService.currentUserValue;
    return currentUser?.role === 'User';
  }

  getCurrentUserRole(): string | null {
    const currentUser = this.authService.currentUserValue;
    return currentUser?.role || null;
  }

  getCurrentUserTenant(): string | null {
    const currentUser = this.authService.currentUserValue;
    return currentUser?.tenantId || null;
  }
}