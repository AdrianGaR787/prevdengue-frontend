import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RiskLevelService {
  private http = inject(HttpClient);
  private url = `${environment.base}/nivelesriesgo`;

  list(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  insert(riskLevel: any): Observable<any> {
    return this.http.post(`${this.url}/nuevo`, riskLevel);
  }

  update(riskLevel: any): Observable<any> {
    return this.http.put(`${this.url}/actualiza`, riskLevel);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/elimina/${id}`, { responseType: 'text' });
  }
}