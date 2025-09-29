import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileService } from '../../service/file-service';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="file-upload">
      <h2>File Management</h2>
      
      <div class="upload-card" *ngIf="!isAdmin">
        <h3>Upload New File</h3>
        <div class="upload-form">
          <div class="form-group">
            <label>Select File:</label>
            <input type="file" (change)="onFileSelect($event)" class="file-input">
          </div>
          <div class="form-group">
            <label>Workspace:</label>
            <select [(ngModel)]="selectedWorkspaceId" class="workspace-select">
              <option value="">Select Workspace</option>
              <option *ngFor="let workspace of workspaces" [value]="workspace.id">{{ workspace.name }}</option>
            </select>
          </div>
          <button (click)="uploadFiles()" [disabled]="!selectedFiles.length || !selectedWorkspaceId" class="upload-btn">
            Upload File
          </button>
        </div>
      </div>

      <div class="files-section">
        <h3>My Files</h3>
        <div class="files-grid" *ngIf="files.length; else noFiles">
          <div class="file-card" *ngFor="let file of files">
            <div class="file-icon">FILE</div>
            <div class="file-info">
              <h4>{{ file.fileName }}</h4>
              <p>{{ file.fileType }}</p>
              <p>{{ file.fileSize | number }} bytes</p>
              <p>Uploaded: {{ file.uploadedAt | date:'short' }}</p>
            </div>
            <div class="file-actions">
              <button *ngFor="let link of file.links" 
                      [class]="'btn-' + link.rel" 
                      (click)="performAction(link, file)">
                {{ link.rel | titlecase }}
              </button>
            </div>
          </div>
        </div>
        <ng-template #noFiles>
          <p class="no-files">No files uploaded yet.</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .file-upload { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    
    .upload-card { background: white; border: 1px solid #ddd; border-radius: 12px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .upload-card h3 { margin-top: 0; color: #333; }
    
    .upload-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-group label { font-weight: 600; margin-bottom: 0.5rem; color: #555; }
    
    .file-input, .workspace-select { padding: 0.75rem; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 1rem; }
    .file-input:focus, .workspace-select:focus { outline: none; border-color: #007bff; }
    
    .upload-btn { padding: 0.75rem 2rem; background: #28a745; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; transition: background 0.2s; }
    .upload-btn:hover:not(:disabled) { background: #218838; }
    .upload-btn:disabled { background: #6c757d; cursor: not-allowed; }
    
    .files-section h3 { color: #333; margin-bottom: 1rem; }
    .files-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    
    .file-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s; }
    .file-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    
    .file-icon { font-size: 1rem; text-align: center; margin-bottom: 1rem; font-weight: bold; color: #666; }
    .file-info h4 { margin: 0 0 0.5rem 0; color: #333; }
    .file-info p { margin: 0.25rem 0; color: #666; font-size: 0.9rem; }
    
    .file-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .btn-view, .btn-edit, .btn-delete { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; margin-right: 0.5rem; }
    .btn-view { background: #007bff; color: white; }
    .btn-view:hover { background: #0056b3; }
    .btn-edit { background: #ffc107; color: #212529; }
    .btn-edit:hover { background: #e0a800; }
    .btn-delete { background: #dc3545; color: white; }
    .btn-delete:hover { background: #c82333; }
    
    .no-files { text-align: center; color: #666; font-style: italic; padding: 2rem; }
  `]
})
export class FileUpload implements OnInit {
  selectedFiles: File[] = [];
  selectedWorkspaceId = '';
  workspaces: any[] = [];
  files: any[] = [];
  
  constructor(
    private http: HttpClient,
    private fileService: FileService,
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    if (!this.isAdmin) {
      this.loadWorkspaces();
    }
    this.loadFiles();
  }
  
  get isAdmin(): boolean {
    const user = this.authService.currentUserValue;
    return user?.role === 'Admin';
  }
  
  onFileSelect(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
  loadWorkspaces(): void {
    this.http.get<any>('https://localhost:7147/api/WorkSpace', { headers: this.getHeaders() }).subscribe({
      next: (response) => {
        this.workspaces = response.data || [];
      },
      error: (error) => console.error('Error loading workspaces:', error)
    });
  }
  
  uploadFiles(): void {
    if (this.selectedFiles.length && this.selectedWorkspaceId) {
      this.selectedFiles.forEach(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('workspaceId', this.selectedWorkspaceId);
        
        this.http.post('https://localhost:7147/api/FileItem/upload', formData, { headers: this.getHeaders() }).subscribe({
          next: (response: any) => {
            alert(`File "${file.name}" uploaded successfully!`);
          },
          error: (error) => {
            alert(`Failed to upload "${file.name}": ${error.error?.message || error.message}`);
          }
        });
      });
      
      this.selectedFiles = [];
      this.selectedWorkspaceId = '';
      this.loadFiles();
    }
  }
  
  loadFiles(): void {
    this.http.get<any>('https://localhost:7147/api/FileItem', { headers: this.getHeaders() }).subscribe({
      next: (response) => {
        this.files = response.data || [];
      },
      error: (error) => console.error('Error loading files:', error)
    });
  }
  
  viewFile(fileId: string): void {
    this.http.get(`https://localhost:7147/api/FileItem/${fileId}`, { headers: this.getHeaders() }).subscribe({
      next: (response: any) => {
        const fileData = response.data;
        if (fileData?.fileContent) {
          // Create blob from base64 data
          const byteCharacters = atob(fileData.fileContent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: fileData.fileType });
          
          // Create URL and open in new tab
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          
          // Clean up URL after a delay
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else {
          alert('File content not available');
        }
      },
      error: (error) => {
        console.error('Error viewing file:', error);
        alert('Failed to view file: ' + (error.error?.message || error.message));
      }
    });
  }
  
  editFile(fileId: string): void {
    const newName = prompt('Enter new file name:');
    if (newName) {
      this.http.put(`https://localhost:7147/api/FileItem/${fileId}`, 
        { fileName: newName }, 
        { headers: this.getHeaders() }
      ).subscribe({
        next: () => {
          alert('File updated successfully!');
          this.loadFiles();
        },
        error: (error) => {
          console.error('Error editing file:', error);
          alert('Failed to edit file: ' + (error.error?.message || error.message));
        }
      });
    }
  }
  
  performAction(link: any, file: any): void {
    switch (link.rel) {
      case 'view':
        this.viewFile(file.id);
        break;
      case 'edit':
        this.editFile(file.id);
        break;
      case 'delete':
        this.deleteFile(file.id);
        break;
    }
  }
  
  deleteFile(fileId: string): void {
    if (confirm('Are you sure you want to delete this file?')) {
      this.http.delete(`https://localhost:7147/api/FileItem/${fileId}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          alert('File deleted successfully!');
          this.loadFiles();
        },
        error: (error) => {
          console.error('Error deleting file:', error);
          alert('Failed to delete file: ' + (error.error?.message || error.message));
        }
      });
    }
  }
}