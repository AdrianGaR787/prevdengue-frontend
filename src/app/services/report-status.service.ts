import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReportStatus } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class ReportStatusService {
  private apiUrl = `${environment.apiUrl}/estadosinforme`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ReportStatus[]> {
    return this.http.get<ReportStatus[]>(this.apiUrl);
  }

  getById(id: number): Observable<ReportStatus> {
    return this.http.get<ReportStatus>(`${this.apiUrl}/${id}`);
  }

  create(status: ReportStatus): Observable<ReportStatus> {
    return this.http.post<ReportStatus>(`${this.apiUrl}/nuevo`, status);
  }

  update(status: ReportStatus): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualiza`, status, { responseType: 'text' });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/elimina/${id}`, { responseType: 'text' });
  }
}