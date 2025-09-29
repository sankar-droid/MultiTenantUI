import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { UserWebDTO, UserWebDetail } from '../Models/UserWebDTO';
import { RestDto } from '../Models/LinkDTO';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<UserWebDTO> {
  constructor(http: HttpClient) {
    super(http, 'https://localhost:7147/api/UserWeb');
  }

  getDetail(id: string) {
    return this.http.get<RestDto<UserWebDetail>>(`${this.apiPath}/${id}`);
  }
}