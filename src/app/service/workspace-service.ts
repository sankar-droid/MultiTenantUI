import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { WorkSpaceDTO, WorkSpaceDetailDto } from '../Models/WorkSpaceDTO';
import { RestDto } from '../Models/LinkDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService extends BaseService<WorkSpaceDTO> {
  constructor(http: HttpClient) {
    super(http, 'https://localhost:7147/api/WorkSpace');
  }

  createWorkspace(entity: Partial<WorkSpaceDTO>) {
    return this.http.post<RestDto<WorkSpaceDTO>>(`${this.apiPath}/create`, entity);
  }

  getDetail(id: string) {
    return this.http.get<RestDto<WorkSpaceDetailDto>>(`${this.apiPath}/${id}`);
  }
}