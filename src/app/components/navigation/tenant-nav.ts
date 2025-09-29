import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-tenant-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="tenant-nav">
      <div class="nav-brand">{{ currentUser?.tenantId }}</div>
      <ul class="nav-links">
        <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
        <li *ngIf="!isAdmin"><a routerLink="/files" routerLinkActive="active">Files</a></li>

        <li><a routerLink="/messages" routerLinkActive="active">Messages</a></li>
        <li *ngIf="isAdmin"><a routerLink="/users" routerLinkActive="active">Users</a></li>
        <li *ngIf="isAdmin"><a routerLink="/workspaces" routerLinkActive="active">Workspaces</a></li>
        <li *ngIf="isAdmin"><a routerLink="/audit" routerLinkActive="active">Audit Logs</a></li>
        <li><a routerLink="/profile" routerLinkActive="active">Profile</a></li>
        <li><button (click)="logout()">Logout</button></li>
      </ul>
    </nav>
  `,
  styles: [`
    .tenant-nav { display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; height: 64px; background: #343a40; border-bottom: 1px solid #495057; }
    .nav-brand { font-weight: 700; font-size: 1.2rem; color: white; }
    .nav-links { display: flex; list-style: none; gap: 0.5rem; margin: 0; padding: 0; align-items: center; }
    .nav-links a, .nav-links button { 
      color: #adb5bd; 
      text-decoration: none; 
      padding: 0.5rem 1rem; 
      border-radius: 6px; 
      font-weight: 500; 
      transition: background-color 0.2s, color 0.2s; 
    }
    .nav-links a:hover, .nav-links button:hover:not(.logout-btn) { background-color: #495057; color: white; }
    .nav-links a.active { background-color: var(--primary-color); color: white; }
    .nav-links a.active:hover { background-color: var(--primary-hover); }
    .nav-links button { background: transparent; border: none; cursor: pointer; font-size: 1rem; }
    .logout-btn { color: var(--danger-color) !important; font-weight: 500; }
    .logout-btn:hover { background-color: var(--danger-color) !important; color: white !important; }
  `]
})
export class TenantNav {
  currentUser: any = null;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }
  
  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}