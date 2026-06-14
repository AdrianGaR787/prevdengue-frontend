import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NeighborValidation } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NeighborValidationService {
  private apiUrl = `${environment.apiUrl}/validacion-vecinal`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<NeighborValidation[]> {
    return this.http.get<NeighborValidation[]>(this.apiUrl);
  }

  getById(id: number): Observable<NeighborValidation> {
    return this.http.get<NeighborValidation>(`${this.apiUrl}/${id}`);
  }

  create(validation: NeighborValidation): Observable<NeighborValidation> {
    return this.http.post<NeighborValidation>(`${this.apiUrl}/nuevo`, validation);
  }

  update(validation: NeighborValidation): Observable<NeighborValidation> {
    return this.http.put<NeighborValidation>(`${this.apiUrl}/actualiza`, validation);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/elimina/${id}`, { responseType: 'text' });
  }
}