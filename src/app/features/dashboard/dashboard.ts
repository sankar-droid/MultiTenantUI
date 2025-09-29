import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <h1>Welcome, {{ currentUser?.userName }}</h1>
      
      <!-- Admin Filter Controls -->
      <div *ngIf="isAdmin" class="admin-controls">
        <h2>Admin Management</h2>

        <div class="dashboard-cards admin-summary">
          <div class="card">
            <h3>Tenant: {{ currentUser?.tenantId }}</h3>
            <p>Role: {{ currentUser?.role }}</p>
          </div>
          <div class="card">
            <h3>Quick Actions</h3>
            <p>View users, workspaces, and audit logs below.</p>
          </div>
        </div>
        
        <div class="filter-section">
          <h3>Users ({{totalUsers}})</h3>
          <div class="filter-row">
            <select [(ngModel)]="userSortColumn" (change)="loadUsers()">
              <option value="Username">Username</option>
              <option value="Email">Email</option>
              <option value="TenantId">Tenant</option>
            </select>
            <select [(ngModel)]="userSortOrder" (change)="loadUsers()">
              <option value="ASC">A-Z</option>
              <option value="DESC">Z-A</option>
            </select>
            <select [(ngModel)]="userPageIndex" (change)="loadUsers()">
              <option value="0">Beginning</option>
              <option value="10">Record 11+</option>
              <option value="20">Record 21+</option>
            </select>
          </div>
          <div class="data-grid">
            <div *ngFor="let user of users" class="data-item">
              <strong>{{user.username}}</strong> - {{user.email}}
            </div>
          </div>
        </div>
        
        <div class="filter-section">
          <h3>Workspaces ({{totalWorkspaces}})</h3>
          <div class="filter-row">
            <select [(ngModel)]="workspaceSortColumn" (change)="loadWorkspaces()">
              <option value="Name">Name</option>
              <option value="TenantId">Tenant</option>
            </select>
            <select [(ngModel)]="workspaceSortOrder" (change)="loadWorkspaces()">
              <option value="ASC">A-Z</option>
              <option value="DESC">Z-A</option>
            </select>
            <select [(ngModel)]="workspacePageIndex" (change)="loadWorkspaces()">
              <option value="0">Beginning</option>
              <option value="10">Record 11+</option>
              <option value="20">Record 21+</option>
            </select>
          </div>
          <div class="data-grid">
            <div *ngFor="let workspace of workspaces" class="data-item">
              <strong>{{workspace.name}}</strong>
            </div>
          </div>
        </div>
        
        <div class="filter-section">
          <h3>Audit Logs ({{totalAuditLogs}})</h3>
          <div class="filter-row">
            <select [(ngModel)]="auditSortColumn" (change)="loadAuditLogs()">
              <option value="Timestamp">Time</option>
              <option value="Action">Action</option>
            </select>
            <select [(ngModel)]="auditSortOrder" (change)="loadAuditLogs()">
              <option value="DESC">Newest</option>
              <option value="ASC">Oldest</option>
            </select>
            <select [(ngModel)]="auditPageIndex" (change)="loadAuditLogs()">
              <option value="0">Beginning</option>
              <option value="10">Record 11+</option>
              <option value="20">Record 21+</option>
            </select>
          </div>
          <div class="data-grid">
            <div *ngFor="let log of auditLogs" class="data-item">
              <small>{{formatDate(log.timestamp)}}</small><br>
              {{log.action}}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Regular Dashboard -->
      <div *ngIf="!isAdmin" class="dashboard-cards">
        <div class="card">
          <h3>Tenant: {{ currentUser?.tenantId }}</h3>
          <p>Role: {{ currentUser?.role }}</p>
        </div>
        <div class="card">
          <h3>Quick Actions</h3>
          <p>Upload files and send messages using the navigation.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; padding: 2rem; background-color: #f4f7f6; }
    h1 { font-weight: 300; font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-color); }
    .admin-controls { background: transparent; padding: 0; border: none; box-shadow: none; margin-top: 1rem; }
    .admin-controls h2 { margin-top: 0; padding-bottom: 1rem; border-bottom: 1px solid var(--medium-gray); font-size: 1.8rem; }
    .admin-summary { margin-top: 2rem; margin-bottom: 2.5rem; }
    .filter-section { 
      margin-bottom: 2.5rem; 
      background: white; 
      border: 1px solid var(--medium-gray); 
      padding: 1.5rem 2rem; 
      border-radius: var(--border-radius); 
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .filter-section:last-child { margin-bottom: 0; }
    .filter-section h3 { font-size: 1.4rem; color: var(--text-color); margin-top: 0; padding-bottom: 0.75rem; margin-bottom: 1.5rem; }
    .filter-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; }
    .filter-row select { padding: 0.6rem 0.8rem; border: 1px solid #ced4da; border-radius: 6px; background-color: white; font-size: 0.95rem; color: var(--text-color); }
    .filter-row select:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); }
    .data-grid { max-height: 240px; overflow-y: auto; border-radius: 6px; margin-top: 1rem; background-color: #fdfdfd; padding: 0.5rem; border: 1px solid var(--medium-gray); }
    .data-item { padding: 0.85rem 1.2rem; border-bottom: 1px solid var(--medium-gray); background: white; font-size: 0.95rem; transition: background-color 0.2s; border-radius: 4px; margin-bottom: 0.5rem; }
    .data-item:last-child { border-bottom: none; }
    .data-item:hover { background-color: #f0f8ff; }
    .data-item strong { font-weight: 500; }
    .data-item small { color: var(--dark-gray); display: block; margin-bottom: 0.25rem; font-size: 0.8rem; }
    .dashboard-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
    .card { 
      color: white; 
      padding: 1.5rem; 
      border-radius: var(--border-radius); 
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    .card:nth-child(odd) { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .card:nth-child(even) { background: linear-gradient(135deg, #2af598 0%, #009efd 100%); }
    .card h3 { margin-top: 0; font-size: 1.2rem; color: white; }
    .card p { color: white; opacity: 0.9; }
  `]
})
export class Dashboard implements OnInit {
  currentUser: any = null;
  
  
  users: any[] = [];
  workspaces: any[] = [];
  auditLogs: any[] = [];
  
 
  totalUsers = 0;
  totalWorkspaces = 0;
  totalAuditLogs = 0;
  
  
  userSortColumn = 'Username';
  userSortOrder = 'ASC';
  userPageIndex = 0;
  
 
  workspaceSortColumn = 'Name';
  workspaceSortOrder = 'ASC';
  workspacePageIndex = 0;
  
  
  auditSortColumn = 'Timestamp';
  auditSortOrder = 'DESC';
  auditPageIndex = 0;
  
  constructor(private authService: AuthService, private http: HttpClient) {
    this.currentUser = this.authService.currentUserValue;
  }
  
  ngOnInit(): void {
    if (this.isAdmin) {
      this.loadUsers();
      this.loadWorkspaces();
      this.loadAuditLogs();
    }
  }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  loadUsers(): void {
    const params = `pageIndex=${this.userPageIndex}&pageSize=10&sortColumn=${this.userSortColumn}&sortOrder=${this.userSortOrder}`;
    this.http.get<any>(`https://localhost:7147/api/UserWeb?${params}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.users = data.data || [];
          this.totalUsers = data.recordCount || 0;
        },
        error: (error) => console.error('Error loading users:', error)
      });
  }
  
  loadWorkspaces(): void {
    const params = `pageIndex=${this.workspacePageIndex}&pageSize=10&sortColumn=${this.workspaceSortColumn}&sortOrder=${this.workspaceSortOrder}`;
    this.http.get<any>(`https://localhost:7147/api/WorkSpace?${params}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.workspaces = data.data || [];
          this.totalWorkspaces = data.recordCount || 0;
        },
        error: (error) => console.error('Error loading workspaces:', error)
      });
  }
  
  loadAuditLogs(): void {
    const params = `pageIndex=${this.auditPageIndex}&pageSize=10&sortColumn=${this.auditSortColumn}&sortOrder=${this.auditSortOrder}`;
    this.http.get<any>(`https://localhost:7147/api/AuditLog?${params}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.auditLogs = data.data || [];
          this.totalAuditLogs = data.recordCount || 0;
        },
        error: (error) => console.error('Error loading audit logs:', error)
      });
  }
  
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }
  
  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }
}