import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkspaceService } from '../../../service/workspace-service';
import { WorkSpaceDTO } from '../../../Models/WorkSpaceDTO';

@Component({
  selector: 'app-workspace-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './workspace-list.html',
  styleUrl: './workspace-list.css'
})
export class WorkspaceList implements OnInit {
  workspaces: WorkSpaceDTO[] = [];

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.workspaceService.getAll().subscribe({
      next: (data) => {
        this.workspaces = data.data || [];
      },
      error: (error) => {
        console.error('Error loading workspaces:', error);
        this.workspaces = [];
      }
    });
  }

  deleteWorkspace(id: string): void {
    if (confirm('Are you sure you want to delete this workspace?')) {
      this.workspaceService.delete(id).subscribe({
        next: () => {
          this.workspaces = this.workspaces.filter(w => w.id !== id);
          alert('Workspace deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting workspace:', error);
          alert('Failed to delete workspace');
        }
      });
    }
  }
}