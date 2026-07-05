import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SymptomService {
  private http = inject(HttpClient);
  private url = `${environment.base}/sintomas`;

  list(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  insert(symptom: any): Observable<any> {
    return this.http.post(`${this.url}/nuevo`, symptom);
  }

  update(symptom: any): Observable<any> {
    return this.http.put(`${this.url}/actualiza`, symptom);
  }

  delete(id: number): Observable<any> {
    // Tu backend devuelve un String al eliminar, por eso usamos responseType: 'text'
    return this.http.delete(`${this.url}/elimina/${id}`, { responseType: 'text' });
  }
  // 📊 Consulta analítica: Síntomas más frecuentes
  getMostFrequentSymptoms(): Observable<any[]> {
    // Asegúrate de que '/mas-frecuentes' coincida con tu endpoint en Spring Boot
    return this.http.get<any[]>(`${this.url}/mas-frecuentes`);
  }
}