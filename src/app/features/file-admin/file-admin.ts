import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-file-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-admin">
      <h2>File Management (Admin)</h2>
      
      <div class="files-list">
        <h3>All Uploaded Files</h3>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Uploaded By</th>
              <th>Workspace</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let file of files$ | async">
              <td>{{ file.fileName }}</td>
              <td>{{ file.uploadedById }}</td>
              <td>{{ file.workSpace?.name }}</td>
              <td>{{ file.uploadedAt | date:'medium' }}</td>
              <td>
                <button (click)="deleteFile(file.id)" class="delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .file-admin { padding: 2rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: bold; }
    .delete { background: #dc3545; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; }
  `]
})
export class FileAdmin implements OnInit {
  private filesSubject = new BehaviorSubject<any[]>([]);
  files$ = this.filesSubject.asObservable();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFiles();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadFiles() {
    this.http.get<any>('https://localhost:7147/api/FileItem', { headers: this.getHeaders() }).subscribe({
      next: (response) => {
        this.filesSubject.next(response.data || []);
      },
      error: (error) => console.error('Error loading files:', error)
    });
  }

  deleteFile(fileId: string) {
    if (confirm('Are you sure you want to delete this file?')) {
      this.http.delete(`https://localhost:7147/api/FileItem/${fileId}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          // Update observable by removing deleted file
          const currentFiles = this.filesSubject.value;
          const updatedFiles = currentFiles.filter(f => f.id !== fileId);
          this.filesSubject.next(updatedFiles);
          alert('File deleted successfully');
        },
        error: (error) => alert('Failed to delete file: ' + (error.error?.message || error.message))
      });
    }
  }
}