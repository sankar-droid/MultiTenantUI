import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { TenantDetailDto, TenantDTO } from '../Models/TenantDTO';
import { RestDto } from '../Models/LinkDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TenantService extends BaseService<TenantDTO> {
  constructor(http:HttpClient)
  {
    super(http,'https://localhost:7147/api/Tenant');

  }
  getDetail(id:string){
    return this.http.get<RestDto<TenantDetailDto>>(`${this.apiPath}/${id}`);
  }
}
