import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-email',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="email-container">
      <div class="email-header">
        <h2>📧 Send Email</h2>
        <p>Send messages to users in your organization</p>
      </div>

      <div class="email-form">
        <div class="form-group">
          <label>To:</label>
          <select [(ngModel)]="selectedUser" class="form-control">
            <option value="">Select recipient...</option>
            <option *ngFor="let user of tenantUsers" [value]="user.username">
              {{user.username}} ({{user.username}}@{{getTenantDomain()}})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Subject:</label>
          <input [(ngModel)]="subject" class="form-control" placeholder="Enter subject...">
        </div>

        <div class="form-group">
          <label>Message:</label>
          <textarea [(ngModel)]="body" class="form-control" rows="6" placeholder="Type your message..."></textarea>
        </div>

        <button (click)="sendEmail()" [disabled]="!selectedUser || !subject || !body" class="send-btn">
          Send Email
        </button>
      </div>

      <div class="sent-emails" *ngIf="sentEmails.length > 0">
        <h3>📤 Sent Emails</h3>
        <div class="email-item" *ngFor="let email of sentEmails">
          <div class="email-info">
            <strong>To:</strong> {{email.to}} <br>
            <strong>Subject:</strong> {{email.subject}} <br>
            <small>{{email.timestamp}}</small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .email-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .email-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }

    .email-header h2 {
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .email-form {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 10px;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .send-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .send-btn:hover:not(:disabled) {
      background: #218838;
    }

    .send-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .sent-emails {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
    }

    .sent-emails h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .email-item {
      background: white;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 6px;
      border-left: 4px solid #28a745;
    }

    .email-info {
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .email-info small {
      color: #666;
    }
  `]
})
export class EmailComponent implements OnInit {
  tenantUsers: any[] = [];
  selectedUser = '';
  subject = '';
  body = '';
  sentEmails: any[] = [];
  currentUser: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
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

    const recipientEmail = `${this.selectedUser}@${this.getTenantDomain()}`;
    
    const emailData = {
      to: recipientEmail,
      subject: this.subject,
      body: this.body,
      isHtml: false
    };

    // Simulate sending email - just add to sent list
    this.sentEmails.unshift({
      to: recipientEmail,
      subject: this.subject,
      timestamp: new Date().toLocaleString()
    });
    
    // Clear form
    this.selectedUser = '';
    this.subject = '';
    this.body = '';
    
    alert('📧 Email sent successfully! (Simulated)');
  }
}