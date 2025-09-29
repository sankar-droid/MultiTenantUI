import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestDTO } from '../Models/RestDTO';

export interface MessageDTO {
  id: string;
  subject: string;
  from: string;
  date: Date;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'https://localhost:7147/api/Message';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RestDTO<MessageDTO[]>> {
    return this.http.get<RestDTO<MessageDTO[]>>(this.apiUrl);
  }

  syncEmails(): Observable<any> {
    return this.http.post(`${this.apiUrl}/sync-emails`, {});
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}