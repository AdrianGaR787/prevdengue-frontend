import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Report } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl);
  }

  getById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${id}`);
  }

  create(report: Report): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/nuevo`, report);
  }

  update(report: Report): Observable<Report> {
    return this.http.put<Report>(`${this.apiUrl}/actualiza`, report);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/elimina/${id}`, { responseType: 'text' });
  }

  getCountByHatcheryType(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reportes-tipo-criadero`);
  }

  getCountByStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reporte-por-estado`);
  }

  getReportsWithMostSymptoms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/con-mas-sintomas`);
  }

  getHighRiskReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/zonas-alto-riesgo`);
  }

  getByDistrict(id: number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/por-distrito/${id}`);
  }

  getDistrictRanking(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ranking-distritos`);
  }
}