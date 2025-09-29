import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-inbox',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inbox-container">
      <div class="inbox-header">
        <h2>📧 Email Inbox</h2>
        <button class="compose-btn" (click)="showCompose = !showCompose">
          {{ showCompose ? 'Cancel' : 'Compose Email' }}
        </button>
      </div>

      <div class="compose-section" *ngIf="showCompose">
        <h3>Send Email</h3>
        <div class="form-group">
          <select [(ngModel)]="selectedUser" class="form-control">
            <option value="">Select recipient...</option>
            <option *ngFor="let user of tenantUsers" [value]="user.username">
              {{user.username}}@{{getTenantDomain()}}
            </option>
          </select>
        </div>
        <div class="form-group">
          <input [(ngModel)]="subject" class="form-control" placeholder="Subject...">
        </div>
        <div class="form-group">
          <textarea [(ngModel)]="body" class="form-control" rows="4" placeholder="Message..."></textarea>
        </div>
        <button (click)="sendEmail()" [disabled]="!selectedUser || !subject || !body" class="send-btn">
          Send Email
        </button>
      </div>

      <div class="emails-section">
        <h3>Your Emails ({{emails.length}})</h3>
        <div class="email-list" *ngIf="emails.length > 0">
          <div class="email-item" *ngFor="let email of emails">
            <div class="email-header">
              <strong>{{email.subject}}</strong>
              <span class="email-meta">{{email.from}} → {{email.to}}</span>
              <small class="email-time">{{formatDate(email.sentAt)}}</small>
            </div>
            <div class="email-body">{{email.body}}</div>
          </div>
        </div>
        <div class="no-emails" *ngIf="emails.length === 0">
          No emails found
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inbox-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .inbox-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }

    .compose-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .compose-section {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 10px;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
    }

    .send-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .send-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .email-item {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .email-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .email-meta {
      color: #666;
      font-size: 0.9rem;
    }

    .email-time {
      color: #999;
      font-size: 0.8rem;
    }

    .email-body {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid #007bff;
    }

    .no-emails {
      text-align: center;
      color: #666;
      padding: 2rem;
    }
  `]
})
export class InboxComponent implements OnInit {
  emails: any[] = [];
  tenantUsers: any[] = [];
  showCompose = false;
  selectedUser = '';
  subject = '';
  body = '';
  currentUser: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadEmails();
    this.loadTenantUsers();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadEmails(): void {
    this.http.get<any>('https://localhost:7147/api/Mail/inbox', { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          this.emails = response.data || [];
        },
        error: (error) => console.error('Error loading emails:', error)
      });
  }

  loadTenantUsers(): void {
    this.http.get<any>('https://localhost:7147/api/UserWeb', { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          this.tenantUsers = response.data?.filter((user: any) => 
            user.username !== this.currentUser?.userName
          ) || [];
        },
        error: (error) => console.error('Error loading users:', error)
      });
  }

  getTenantDomain(): string {
    const tenantDomains: { [key: string]: string } = {
      '70E3318C-D2DD-47AB-8334-AF1394BD66C0': 'mscorp.com',
    };
    return tenantDomains[this.currentUser?.tenantId] || 'company.com';
  }

  sendEmail(): void {
    if (!this.selectedUser || !this.subject || !this.body) return;

    const emailData = {
      to: `${this.selectedUser}@${this.getTenantDomain()}`,
      subject: this.subject,
      body: this.body,
      isHtml: false
    };

    this.http.post('https://localhost:7147/api/Mail/send-email', emailData, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          alert('📧 Email sent successfully!');
          this.selectedUser = '';
          this.subject = '';
          this.body = '';
          this.showCompose = false;
          this.loadEmails(); // Refresh inbox
        },
        error: () => alert('Failed to send email')
      });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }
}