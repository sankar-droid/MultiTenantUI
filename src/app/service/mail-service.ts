import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailDTO } from '../Models/EmailDTO';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private apiUrl = 'https://localhost:7147/api/Mail';

  constructor(private http: HttpClient) {}

  sendEmail(emailData: EmailDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-email`, emailData);
  }
}