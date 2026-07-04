import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HatcheryTypeService {
  private http = inject(HttpClient);
  private url = `${environment.base}/tiposcriaderos`;

  list(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  insert(hatcheryType: any): Observable<any> {
    return this.http.post(`${this.url}/nuevo`, hatcheryType);
  }

  update(hatcheryType: any): Observable<any> {
    // El backend devuelve un String, usamos responseType: 'text'
    return this.http.put(`${this.url}/actualiza`, hatcheryType, { responseType: 'text' });
  }

  delete(id: number): Observable<any> {
    // El backend devuelve un String, usamos responseType: 'text'
    return this.http.delete(`${this.url}/eliminar/${id}`, { responseType: 'text' });
  }
}