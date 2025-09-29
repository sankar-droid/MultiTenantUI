import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../service/auth-service';
import { WorkSpaceDTO } from '../../Models/WorkSpaceDTO';

@Component({
  selector: 'app-workspace-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonModule],
  template: `
    <div class="workspace-admin">
      <h2>Workspace Management</h2>
      
      <div class="create-workspace">
        <h3>Create New Workspace</h3>
        <form (ngSubmit)="createWorkspace()" #workspaceForm="ngForm">
          <input 
            type="text" 
            [(ngModel)]="newWorkspace.name" 
            name="name"
            placeholder="Workspace Name" 
            required>
          <button type="submit" [disabled]="!workspaceForm.valid">Create</button>
        </form>
      </div>

      <div class="workspace-list">
        <h3>Existing Workspaces ({{ workspaces.length }})</h3>
        <div *ngIf="isLoading" class="loading-indicator">Loading workspaces...</div>
        <div class="workspace-grid" *ngIf="!isLoading">
          <div class="workspace-card" *ngFor="let workspace of workspaces">
            <div class="workspace-card-header">
              <h3>{{ workspace.name }}</h3>
              <button (click)="deleteWorkspace(workspace.id)" class="delete">Delete</button>
            </div>
            <div class="workspace-card-content">
              <h4>Files ({{ workspace.files?.length || 0 }})</h4>
              <ul *ngIf="workspace.files && workspace.files.length > 0" class="file-list">
                <li *ngFor="let file of workspace.files">
                  <span class="file-name">{{ file.fileName }}</span>
                  <span class="file-meta">by {{ file.uploadedByUser }} on {{ file.uploadedAt | date:'shortDate' }}</span>
                </li>
              </ul>
              <div *ngIf="!workspace.files || workspace.files.length === 0" class="no-files">
                No files in this workspace.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .workspace-admin { padding: 2rem; }
    .loading-indicator { text-align: center; padding: 2rem; font-size: 1.2rem; color: #666; }
    .create-workspace { margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; border-radius: 4px; }
    .create-workspace form { display: flex; gap: 1rem; align-items: center; }
    .create-workspace input { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .create-workspace button { padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; }
    .workspace-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
    .workspace-card { background: white; border: 1px solid #e9ecef; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
    .workspace-card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e9ecef; }
    .workspace-card-header h3 { margin: 0; font-size: 1.2rem; }
    .workspace-card-content { padding: 1.5rem; flex-grow: 1; }
    .workspace-card-content h4 { margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: #333; }
    .file-list { list-style: none; padding: 0; margin: 0; }
    .file-list li { padding: 0.75rem 0; border-bottom: 1px solid #f1f3f5; display: flex; flex-direction: column; }
    .file-list li:last-child { border-bottom: none; }
    .file-name { font-weight: 500; color: #212529; }
    .file-meta { font-size: 0.8rem; color: #6c757d; margin-top: 0.25rem; }
    .no-files { padding: 1rem 0; text-align: center; color: #6c757d; font-style: italic; }
    button { padding: 0.25rem 0.5rem; margin-right: 0.5rem; border: none; border-radius: 4px; cursor: pointer; }
    button:not(.delete) { background: #28a745; color: white; }
    .delete { background: #dc3545; color: white; }
  `]
})
export class WorkspaceAdmin implements OnInit {
  workspaces: WorkSpaceDTO[] = [];
  newWorkspace: Partial<WorkSpaceDTO> = { name: '', tenantId: '' };
  isLoading = false;

  constructor(private http: HttpClient, private authService: AuthService) {
    // Set tenantId from the logged-in user
    this.newWorkspace.tenantId = this.authService.currentUserValue?.tenantId;
  }

  ngOnInit() {
    this.loadWorkspaces();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadWorkspaces(): void {
    this.isLoading = true;
    this.http.get<any>('https://localhost:7147/api/WorkSpace', { headers: this.getHeaders() }).subscribe({
      next: (response) => {
        const workspaces = response.data as WorkSpaceDTO[];
        if (workspaces.length === 0) {
          this.workspaces = [];
          return;
        }
        const fileRequests = workspaces.map(ws => 
          this.http.get<any>(`https://localhost:7147/api/WorkSpace/${ws.id}`, { headers: this.getHeaders() })
        );
        forkJoin(fileRequests)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(details => {
            this.workspaces = workspaces.map((ws, index) => ({ ...ws, files: details[index].data.files }));
          });
      },
      error: (error) => {
        console.error('Load workspaces error:', error);
        this.workspaces = [];
      }
    });
  }

  createWorkspace() {
    this.http.post('https://localhost:7147/api/WorkSpace/create', this.newWorkspace, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.newWorkspace.name = ''; // Reset only the name, keep tenantId
        alert('Workspace created successfully!');
        this.loadWorkspaces();
      },
      error: (error) => {
        console.error('Create workspace error:', error);
        alert('Failed to create workspace: ' + (error.error?.message || error.message));
      }
    });
  }



  deleteWorkspace(id: string) {
    if (confirm('Are you sure you want to delete this workspace?')) {
      this.http.delete(`https://localhost:7147/api/WorkSpace/${id}`, { headers: this.getHeaders() }).subscribe(() => {
        this.loadWorkspaces();
      });
    }
  }
}