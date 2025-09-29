import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuditLog } from '../../Models/AuditLog';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="audit-logs">
      <div class="header">
        <h2>Audit Trail</h2>
        <p class="subtitle">Track all system activities and changes</p>
      </div>

      <div class="logs-container">
        <div *ngFor="let log of auditLogs" class="log-card" [class]="getLogTypeClass(log.action)">
          <div class="log-header">
            <div class="log-icon">{{ getLogIcon(log.action) }}</div>
            <div class="log-meta">
              <span class="log-time">{{ log.timestamp | date:'MMM dd, yyyy HH:mm:ss' }}</span>
              <span class="log-type">{{ getLogType(log.action) }}</span>
            </div>
          </div>
          <div class="log-content">
            <p class="log-action">{{ formatAction(log.action) }}</p>
            <div class="log-details" *ngIf="getUserFromAction(log.action)">
              <span class="user-badge">USER: {{ getUserFromAction(log.action) }}</span>
            </div>
          </div>
        </div>
        
        <div *ngIf="auditLogs.length === 0" class="no-logs">
          <div class="empty-state">
            <div class="empty-icon">LOGS</div>
            <h3>No audit logs found</h3>
            <p>System activities will appear here when they occur.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; padding: 2rem; background-color: var(--light-gray); min-height: calc(100vh - 64px); }
    .header { text-align: center; margin-bottom: 3rem; }
    .header h2 { margin: 0; font-size: 2.5rem; font-weight: 300; color: var(--text-color); }
    .subtitle { color: var(--dark-gray); font-size: 1.1rem; margin-top: 0.75rem; line-height: 1.5; }
    .logs-container { display: flex; flex-direction: column; gap: 1rem; }
    .log-card { background: white; border-radius: var(--border-radius); padding: 1.5rem; box-shadow: var(--box-shadow); border-left: 5px solid var(--primary-color); transition: transform 0.2s, box-shadow 0.2s; }
    .log-card:hover { transform: translateY(-3px); box-shadow: 0 6px 10px rgba(0,0,0,0.06); }
    .log-card.upload { border-left-color: var(--success-color); }
    .log-card.delete { border-left-color: var(--danger-color); }
    .log-card.edit { border-left-color: var(--warning-color); }
    .log-card.login { border-left-color: #17a2b8; } /* info color */
    .log-header { display: flex; align-items: center; margin-bottom: 1rem; }
    .log-icon { font-size: 0.7rem; margin-right: 1rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--primary-color); background: #e3f2fd; border-radius: 50%; flex-shrink: 0; }
    .log-meta { flex: 1; }
    .log-time { display: block; font-weight: 500; color: var(--text-color); font-size: 0.95rem; }
    .log-type { display: block; color: var(--dark-gray); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0.25rem; }
    .log-action { margin: 0 0 0.75rem 0; color: var(--text-color); line-height: 1.6; font-size: 0.95rem; }
    .log-details { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .user-badge { background: #e3f2fd; color: #1976d2; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
    .no-logs { padding: 3rem; background: white; border-radius: var(--border-radius); box-shadow: var(--box-shadow); border: 1px solid var(--medium-gray); }
    .empty-state { text-align: center; }
    .empty-icon { font-size: 1.8rem; margin-bottom: 1rem; opacity: 0.6; font-weight: bold; color: var(--dark-gray); background: var(--medium-gray); padding: 1rem; border-radius: var(--border-radius); display: inline-block; }
    .empty-state h3 { color: var(--dark-gray); margin: 0 0 0.75rem 0; font-size: 1.2rem; }
    .empty-state p { color: #999; margin: 0; font-size: 0.95rem; }
    @media (max-width: 768px) {
      .log-card { padding: 1rem; }
      .log-header { flex-direction: column; align-items: flex-start; }
      .log-icon { margin-bottom: 0.5rem; }
    }
  `]
})
export class AuditLogs implements OnInit {
  auditLogs: any[] = [];
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.loadAuditLogs();
  }
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  
  loadAuditLogs(): void {
    this.http.get<any>('https://localhost:7147/api/AuditLog', { headers: this.getHeaders() }).subscribe({
      next: (response) => {
        this.auditLogs = response.data || [];
      },
      error: (error) => console.error('Error loading audit logs:', error)
    });
  }
  
  getLogIcon(action: string): string {
    if (action.includes('uploaded')) return 'UP';
    if (action.includes('deleted')) return 'DEL';
    if (action.includes('updated') || action.includes('edited')) return 'EDIT';
    if (action.includes('login')) return 'LOGIN';
    return 'LOG';
  }
  
  getLogType(action: string): string {
    if (action.includes('uploaded')) return 'File Upload';
    if (action.includes('deleted')) return 'File Deletion';
    if (action.includes('updated') || action.includes('edited')) return 'File Edit';
    if (action.includes('login')) return 'User Login';
    return 'System Activity';
  }
  
  getLogTypeClass(action: string): string {
    if (action.includes('uploaded')) return 'upload';
    if (action.includes('deleted')) return 'delete';
    if (action.includes('updated') || action.includes('edited')) return 'edit';
    if (action.includes('login')) return 'login';
    return 'default';
  }
  
  formatAction(action: string): string {
    return action;
  }
  
  getUserFromAction(action: string): string | null {
    // Extract username from action text
    const userMatch = action.match(/by user '([^']+)'/);
    if (userMatch) {
      return userMatch[1];
    }
    
    // Try other patterns
    const patterns = [
      /user '([^']+)'/,
      /User ([\w]+)/,
      /by ([\w]+)/
    ];
    
    for (const pattern of patterns) {
      const match = action.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }
}