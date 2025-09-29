import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TenantService } from '../../../service/tenant-service';
import { TenantDetailDto } from '../../../Models/TenantDTO';

@Component({
  selector: 'app-tenant-detail',
  imports: [CommonModule],
  templateUrl: './tenant-detail.html',
  styleUrl: './tenant-detail.css'
})
export class TenantDetail implements OnInit {
  tenantResponse: any = null;
  tenant: TenantDetailDto | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route ID parameter:', id);
    console.log('All route params:', this.route.snapshot.paramMap.keys);
    
    if (id) {
      console.log('Making API call with ID:', id);
      this.tenantService.getDetail(id).subscribe({
        next: (response) => {
          console.log('API response:', response);
          this.tenantResponse = response;
          this.tenant = Array.isArray(response.data) ? response.data[0] : response.data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load tenant details';
          this.loading = false;
          console.error('Error loading tenant:', err);
        }
      });
    } else {
      this.error = 'No tenant ID provided';
      this.loading = false;
    }
  }
}