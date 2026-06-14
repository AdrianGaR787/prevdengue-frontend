import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PredictiveAlert } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class PredictiveAlertService {
  private apiUrl = `${environment.apiUrl}/alertas-predictivas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PredictiveAlert[]> {
    return this.http.get<PredictiveAlert[]>(this.apiUrl);
  }

  getById(id: number): Observable<PredictiveAlert> {
    return this.http.get<PredictiveAlert>(`${this.apiUrl}/${id}`);
  }

  create(alert: PredictiveAlert): Observable<PredictiveAlert> {
    return this.http.post<PredictiveAlert>(`${this.apiUrl}/nuevo`, alert);
  }

  update(alert: PredictiveAlert): Observable<PredictiveAlert> {
    return this.http.put<PredictiveAlert>(`${this.apiUrl}/actualiza`, alert);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/elimina/${id}`, { responseType: 'text' });
  }
}