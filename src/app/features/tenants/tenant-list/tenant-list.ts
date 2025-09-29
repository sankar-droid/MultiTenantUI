import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TenantService } from '../../../service/tenant-service';
import { TenantDTO } from '../../../Models/TenantDTO';
@Component({
  selector: 'app-tenant-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.css'
})
export class TenantList implements OnInit {

  constructor(private tenantService: TenantService) { }
  tenants: TenantDTO[] = [];
  ngOnInit(): void {
      this.tenantService.getAll().subscribe(data=>{
        this.tenants=data.data;
      });
  }

}
