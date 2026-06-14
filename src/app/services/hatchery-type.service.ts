import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HatcheryType } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class HatcheryTypeService {
  private apiUrl = `${environment.apiUrl}/tiposcriaderos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<HatcheryType[]> {
    return this.http.get<HatcheryType[]>(this.apiUrl);
  }

  getById(id: number): Observable<HatcheryType> {
    return this.http.get<HatcheryType>(`${this.apiUrl}/${id}`);
  }

  create(hatcheryType: HatcheryType): Observable<HatcheryType> {
    return this.http.post<HatcheryType>(`${this.apiUrl}/nuevo`, hatcheryType);
  }

  update(hatcheryType: HatcheryType): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualiza`, hatcheryType, { responseType: 'text' });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`, { responseType: 'text' });
  }
}