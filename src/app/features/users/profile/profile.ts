import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-title">
          <h1>{{ currentUser?.userName }}</h1>
          <p class="subtitle">{{ tenantDetails?.name || 'Tenant User' }}</p>
        </div>
      </div>
      
      <div class="profile-content" *ngIf="currentUser">
        <div class="info-card">
          <h3>Personal Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-details">
                <label>Email Address</label>
                <span>{{ userDetails?.email || 'Not provided' }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">🆔</div>
              <div class="info-details">
                <label>User ID</label>
                <span>{{ getUserId() }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-card">
          <h3>Organization Details</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon">🏢</div>
              <div class="info-details">
                <label>Tenant Name</label>
                <span>{{ tenantDetails?.name || 'Loading...' }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">🔑</div>
              <div class="info-details">
                <label>Tenant ID</label>
                <span>{{ currentUser.tenantId }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-card">
          <h3>Account Settings</h3>
          <div class="edit-actions">
            <button class="edit-btn" (click)="editUsername()" *ngIf="!isAdmin">Change Username</button>
            <button class="edit-btn" (click)="editPassword()" *ngIf="!isAdmin">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; padding: 2rem; background-color: var(--light-gray); min-height: calc(100vh - 64px); }
    .profile-container { max-width: 800px; margin: 0 auto; background-color: white; border-radius: var(--border-radius); box-shadow: var(--box-shadow); border: 1px solid var(--medium-gray); }
    .profile-header { text-align: center; padding: 2.5rem 2rem 2rem; border-bottom: 1px solid var(--medium-gray); background-color: var(--light-gray); border-top-left-radius: var(--border-radius); border-top-right-radius: var(--border-radius); }
    .profile-title h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.8rem;
      font-weight: 300;
      color: var(--text-color);
    }
    .subtitle { margin: 0; font-size: 1.2rem; color: var(--dark-gray); }
    .profile-content { display: flex; flex-direction: column; gap: 2rem; padding: 2rem; }
    .info-card {
      background: linear-gradient(145deg, #ffffff, #e6e6e6);
      border-radius: var(--border-radius); 
      padding: 2rem; 
      border: 1px solid var(--medium-gray); 
      box-shadow: 5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff;
    }
    .info-card h3 { margin: 0 0 1.5rem 0; color: var(--text-color); font-size: 1.3rem; font-weight: 600; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    .info-item { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.2rem 1.5rem; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #f1f3f5; }
    .info-icon { font-size: 1.5rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: var(--primary-color); background: #e3f2fd; border-radius: 50%; flex-shrink: 0; }
    .info-details { flex: 1; }
    .info-details label { display: block; font-weight: 600; color: var(--dark-gray); font-size: 0.85rem; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-details span { font-size: 1.05rem; color: var(--text-color); font-weight: 500; word-break: break-all; }
    .edit-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap; }
    .edit-btn { padding: 0.8rem 1.8rem; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: background 0.2s; }
    .edit-btn:hover { background: var(--primary-hover); }
    .email-btn { background: var(--success-color) !important; }
    .email-btn:hover { background: var(--success-hover) !important; }
    @media (max-width: 768px) {
      .profile-container { margin: 0 1rem; }
      .profile-header { padding: 2rem 1rem; }
      .profile-title h1 { font-size: 2.5rem; }
      .info-grid { grid-template-columns: 1fr; }
      .edit-actions { flex-direction: column; align-items: stretch; }
      .edit-btn { width: 100%; }
    }
  `]
})
export class Profile implements OnInit {
  currentUser: any = null;
  userDetails: any = null;
  tenantDetails: any = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.loadUserDetails();
      this.loadTenantDetails();
    }
  }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  loadUserDetails(): void {
    this.userDetails = {
      email: `${this.currentUser.userName.toLowerCase()}@${this.getTenantDomain()}`
    };
  }
  
  loadTenantDetails(): void {
    this.http.get<any>(`https://localhost:7147/api/Tenant/${this.currentUser.tenantId}`, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          this.tenantDetails = response.data;
        },
        error: (err) => console.error('Failed to load tenant details', err)
      });
  }
  
  private getTenantDomain(): string {
    const tenantDomains: { [key: string]: string } = {
      '70E3318C-D2DD-47AB-8334-AF1394BD66C0': 'mscorp.com',
    };
    
    return tenantDomains[this.currentUser.tenantId] || 'company.com';
  }
  
  getUserId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload['UserId'] || 
               payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
               payload['sub'] || 
               'Not Available';
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    return 'Not Available';
  }
  
  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }
  
  editUsername(): void {
    const newUsername = prompt('Enter new username:', this.currentUser?.userName);
    if (newUsername && newUsername !== this.currentUser?.userName) {
      const userId = this.getUserId();
      this.http.put(`https://localhost:7147/api/UserWeb/${userId}`, 
        { username: newUsername }, 
        { headers: this.getHeaders() }
      ).subscribe({
        next: () => {
          alert('Username updated successfully!');
          this.currentUser.userName = newUsername;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        },
        error: (error) => {
          console.error('Error updating username:', error);
          alert('Failed to update username');
        }
      });
    }
  }
  
  editPassword(): void {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
      const userId = this.getUserId();
      this.http.put(`https://localhost:7147/api/UserWeb/${userId}`, 
        { passwordHash: newPassword }, 
        { headers: this.getHeaders() }
      ).subscribe({
        next: () => {
          alert('Password updated successfully!');
        },
        error: (error) => {
          console.error('Error updating password:', error);
          alert('Failed to update password');
        }
      });
    }
  }
  

}