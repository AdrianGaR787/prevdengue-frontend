import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Symptom } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class SymptomService {
  private apiUrl = `${environment.apiUrl}/adrian`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(this.apiUrl);
  }

  getById(id: number): Observable<Symptom> {
    return this.http.get<Symptom>(`${this.apiUrl}/${id}`);
  }

  create(symptom: Symptom): Observable<Symptom> {
    return this.http.post<Symptom>(`${this.apiUrl}/nuevo`, symptom);
  }

  update(symptom: Symptom): Observable<Symptom> {
    return this.http.put<Symptom>(`${this.apiUrl}/actualiza`, symptom);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/elimina/${id}`, { responseType: 'text' });
  }

  getMostFrequentSymptoms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mas-frecuentes`);
  }
}