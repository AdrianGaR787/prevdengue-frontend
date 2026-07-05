import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private http = inject(HttpClient);
  private url = `${environment.base}/roles`;

  list(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  insert(role: any): Observable<any> {
    return this.http.post(`${this.url}/nuevo`, role);
  }

  update(role: any): Observable<any> {
    return this.http.put(`${this.url}/actualiza`, role);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/elimina/${id}`, { responseType: 'text' });
  }
}