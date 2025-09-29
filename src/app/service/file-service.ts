import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { FileItemDTO, FileItemDetailDto } from '../Models/FileItemDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService extends BaseService<FileItemDTO> {
  constructor(http: HttpClient) {
    super(http, 'https://localhost:7147/api/File');
  }

  getDetail(id: string) {
    return this.http.get<FileItemDetailDto>(`${this.apiPath}/${id}`);
  }
}