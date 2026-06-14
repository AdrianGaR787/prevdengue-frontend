import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { District } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private apiUrl = `${environment.apiUrl}/distritos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<District[]> {
    return this.http.get<District[]>(this.apiUrl);
  }

  getById(id: number): Observable<District> {
    return this.http.get<District>(`${this.apiUrl}/${id}`);
  }

  create(district: District): Observable<District> {
    return this.http.post<District>(`${this.apiUrl}/nuevo`, district);
  }

  update(district: District): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualiza`, district, { responseType: 'text' });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`, { responseType: 'text' });
  }
}