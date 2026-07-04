import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';

// district.service.ts
@Injectable({ providedIn: 'root' })
export class DistrictService {
  private http = inject(HttpClient);
  private url = `${environment.base}/distritos`; // Ajusta según tu RequestMapping

  list(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  insert(district: any): Observable<any> {
    return this.http.post(`${this.url}/nuevo`, district);
  }

  update(district: any): Observable<any> {
    // El backend devuelve un String al actualizar, por eso usamos responseType: 'text'
    return this.http.put(`${this.url}/actualiza`, district, { responseType: 'text' });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/eliminar/${id}`, { responseType: 'text' });
  }
}