import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {
  users: any[] = [];
  currentUser: any = null;
  Math = Math;
  
  // Filter controls
  pageIndex = 0;
  pageSize = 10;
  sortColumn = 'Username';
  sortOrder = 'ASC';
  totalCount = 0;
  
  sortColumns = ['Username', 'Email'];
  pageIndexOptions = [0, 10, 20];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadTenantUsers();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadTenantUsers(): void {
    const params = new URLSearchParams({
      pageIndex: this.pageIndex.toString(),
      pageSize: this.pageSize.toString(),
      sortColumn: this.sortColumn,
      sortOrder: this.sortOrder
    });
    
    this.http.get<any>(`https://localhost:7147/api/UserWeb?${params}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.users = data.data || [];
        this.totalCount = data.recordCount || 0;
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }
  
  applyFilters(): void {
    this.loadTenantUsers();
  }
  
  nextPage(): void {
    if ((this.pageIndex + 1) * 10 < this.totalCount) {
      this.pageIndex++;
      this.loadTenantUsers();
    }
  }
  
  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadTenantUsers();
    }
  }
  
  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalCount / 10);
  }

  performAction(link: any, user: any): void {
    switch (link.rel) {
      case 'view':
        this.viewUser(user.id, link.href);
        break;
      case 'delete':
        this.deleteUser(user.id, link.href);
        break;
    }
  }
  
  viewUser(userId: string, viewUrl: string): void {
    this.http.get(viewUrl, { headers: this.getHeaders() }).subscribe({
      next: (response: any) => {
        const userData = response.data;
        alert(`User Details:\nUsername: ${userData.username}\nEmail: ${userData.email}\nID: ${userData.id}`);
      },
      error: (error) => {
        console.error('Error viewing user:', error);
        alert('Failed to view user details');
      }
    });
  }
  


  deleteUser(userId: string, deleteUrl: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(deleteUrl, { headers: this.getHeaders() }).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.loadTenantUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        }
      });
    }
  }
}