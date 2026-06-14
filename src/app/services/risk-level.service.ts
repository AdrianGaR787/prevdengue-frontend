import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RiskLevel } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class RiskLevelService {
  private apiUrl = `${environment.apiUrl}/nivelesriesgo`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RiskLevel[]> {
    return this.http.get<RiskLevel[]>(this.apiUrl);
  }

  getById(id: number): Observable<RiskLevel> {
    return this.http.get<RiskLevel>(`${this.apiUrl}/${id}`);
  }

  create(riskLevel: RiskLevel): Observable<RiskLevel> {
    return this.http.post<RiskLevel>(`${this.apiUrl}/nuevo`, riskLevel);
  }

  update(riskLevel: RiskLevel): Observable<RiskLevel> {
    return this.http.put<RiskLevel>(`${this.apiUrl}/actualiza`, riskLevel);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/elimina/${id}`, { responseType: 'text' });
  }
}