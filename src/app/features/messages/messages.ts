import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="messages">
      <h2>Email System</h2>
      
      <div class="compose-section" *ngIf="!isAdmin">
        <h3>Send Email</h3>
        <select [(ngModel)]="selectedUser" class="form-control">
          <option value="">Select recipient...</option>
          <option *ngFor="let user of tenantUsers" [value]="user.username">
            {{user.username}}@{{getTenantDomain()}}
          </option>
        </select>
        <input [(ngModel)]="subject" placeholder="Subject" class="form-control">
        <textarea [(ngModel)]="body" placeholder="Message" class="form-control"></textarea>
        <button (click)="sendEmail()" class="send-btn" [disabled]="!selectedUser || !subject || !body">Send Email</button>
      </div>

      <div class="emails-section" *ngIf="isAdmin">
        <h3>All Emails ({{emails.length}})</h3>
        <button (click)="loadEmails()" class="refresh-btn">Refresh</button>
        <div class="email-list">
          <div class="email-item" *ngFor="let email of emails">
            <div *ngIf="parseEmailContent(email.content) as parsed">
            <div class="email-header">
                <div class="email-subject">
                  <strong>{{ parsed['Subject'] || 'No Subject' }}</strong>
                  <small class="email-id">ID: {{email.id}}</small>
                </div>
                <button (click)="deleteMessage(email.id)" class="delete-btn">Delete</button>
            </div>
              <div class="email-meta">From: {{ parsed['From'] || 'N/A' }} | To: {{ parsed['To'] || 'N/A' }} | Sent: {{formatDate(email.createdAt)}}</div>
              <div class="email-body">{{ parsed['Body'] }}</div>
            </div>
          </div>
        </div>
        <div class="no-emails" *ngIf="emails.length === 0">
          No emails found
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; padding: 2rem; background-color: var(--light-gray); min-height: calc(100vh - 64px); }
    .messages { max-width: 900px; margin: 0 auto; }
    h2 { margin-bottom: 2.5rem; }
    .compose-section { background: white; padding: 2rem; border-radius: var(--border-radius); margin-bottom: 2.5rem; box-shadow: var(--box-shadow); border: 1px solid var(--medium-gray); }
    .compose-section h3 { margin-top: 0; font-size: 1.25rem; color: var(--text-color); margin-bottom: 1.5rem; }
    .form-control { width: 100%; padding: 0.75rem; margin: 0.5rem 0; border: 1px solid #ced4da; border-radius: 6px; background-color: white; font-size: 1rem; color: var(--text-color); transition: border-color 0.2s, box-shadow 0.2s; }
    .form-control:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); }
    textarea { height: 120px; resize: vertical; }
    button { background: var(--success-color); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer; transition: background-color 0.2s; font-size: 1rem; }
    button:disabled { background: #ccc; cursor: not-allowed; opacity: 0.7; }
    .send-btn { background: var(--success-color); }
    .send-btn:hover:not(:disabled) { background: var(--success-hover); }
    .refresh-btn { background: var(--primary-color); margin-bottom: 1.5rem; align-self: flex-start; }
    .refresh-btn:hover { background: var(--primary-hover); }
    .emails-section h3 { margin-bottom: 1.5rem; font-size: 1.5rem; color: var(--text-color); }
    .email-item { background: white; border: 1px solid var(--medium-gray); border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1rem; box-shadow: var(--box-shadow); transition: transform 0.2s, box-shadow 0.2s; }
    .email-item:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.08); }
    .email-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; gap: 1rem; }
    .email-subject { display: flex; flex-direction: column; }
    .email-subject strong { font-size: 1.1rem; color: var(--text-color); font-weight: 600; }
    .email-id { font-size: 0.75rem; color: #999; margin-top: 0.25rem; }
    .email-meta { font-size: 0.85rem; color: var(--dark-gray); margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--medium-gray); }
    .email-body { background: var(--light-gray); padding: 1rem; border-radius: 6px; border-left: 4px solid var(--primary-color); font-size: 0.95rem; line-height: 1.6; color: var(--text-color); white-space: pre-wrap; word-break: break-word; }
    .no-emails { text-align: center; color: var(--dark-gray); padding: 2rem; background: white; border-radius: var(--border-radius); box-shadow: var(--box-shadow); border: 1px solid var(--medium-gray); }
    .delete-btn { background: var(--danger-color); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; margin-left: auto; font-size: 0.9rem; transition: background-color 0.2s; flex-shrink: 0; }
    .delete-btn:hover { background: var(--danger-hover); }
  `]
})
export class Messages implements OnInit {
  tenantUsers: any[] = [];
  emails: any[] = [];
  selectedUser = '';
  subject = '';
  body = '';
  currentUser: any;
  
  constructor(private authService: AuthService, private http: HttpClient) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.isAdmin) {
      this.loadEmails();
    } else {
      this.loadTenantUsers();
    }
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

    const emailData = {
      to: `${this.selectedUser}@${this.getTenantDomain()}`,
      subject: this.subject,
      body: this.body,
      isHtml: false
    };

    this.http.post('https://localhost:7147/api/Message/send-email', emailData, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          console.log('Email sent response:', response);
          alert('Email sent! Admin can view it in Messages.');
          this.selectedUser = '';
          this.subject = '';
          this.body = '';
        },
        error: (error) => {
          console.error('Send email error:', error);
          alert('Failed to send email');
        }
      });
  }
  
  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }
  
  loadEmails(): void {
    console.log('Loading emails...');
    
    
    this.http.post('https://localhost:7147/api/Message/sync-emails', {}, { headers: this.getHeaders() })
      .subscribe({
        next: (syncResponse) => {
          console.log('Sync response:', syncResponse);
          
        
          setTimeout(() => {
            
            this.http.get<any>('https://localhost:7147/api/Message', { headers: this.getHeaders() })
              .subscribe({
                next: (response) => {
                  this.emails = response.data || [];
                },
                error: (error) => {
                  console.error('Error loading messages:', error);
                  alert('Failed to load messages');
                }
              });
          }, 500);
        },
        error: (error) => {
          console.error('Error syncing emails:', error);
          alert('Failed to sync emails');
        }
      });
  }
  
  parseEmailContent(content: string): { [key: string]: string } {
    const parsed: { [key: string]: string } = {
      From: 'N/A',
      To: 'N/A',
      Subject: 'No Subject',
      Body: ''
    };

    
    const headerBodySplit = content.split('\n\n');
    const headersPart = headerBodySplit[0];
 
    parsed['Body'] = headerBodySplit.slice(1).join('\n\n').trim();

    const headerLines = headersPart.split('\n');
    headerLines.forEach(line => {
      if (line.toLowerCase().startsWith('from: ')) {
        parsed['From'] = line.substring(6).trim();
      } else if (line.toLowerCase().startsWith('to: ')) {
        parsed['To'] = line.substring(4).trim();
      } else if (line.toLowerCase().startsWith('subject: ')) {
        parsed['Subject'] = line.substring(9).trim();
      }
    });

    return parsed;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }
  
  deleteMessage(messageId: string): void {
    if (confirm('Are you sure you want to delete this message?')) {
      this.http.delete(`https://localhost:7147/api/Message/${messageId}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            this.loadEmails(); // Refresh list
            alert('Message deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
          }
        });
    }
  }
}