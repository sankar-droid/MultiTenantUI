import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-workspace-detail',
  imports: [CommonModule],
  templateUrl: './workspace-detail.html',
  styleUrl: './workspace-detail.css'
})
export class WorkspaceDetail implements OnInit {
  workspace: any = null;
  files: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadWorkspaceDetails(id);
    } else {
      this.error = 'No workspace ID provided';
      this.loading = false;
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadWorkspaceDetails(id: string): void {
    this.http.get<any>(`https://localhost:7147/api/WorkSpace/${id}`, { headers: this.getHeaders() }).subscribe({
      next: (response) => {
        this.workspace = response.data;
        this.files = response.data?.files || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading workspace details:', err);
        this.error = 'Failed to load workspace details';
        this.loading = false;
      }
    });
  }

  viewFile(file: any): void {
    if (file.fileContent) {
      const byteCharacters = atob(file.fileContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.fileType });
      
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      alert('File content not available');
    }
  }
}