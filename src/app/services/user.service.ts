import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/nuevo`, user, { responseType: 'text' });
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/actualiza`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/elimina/${id}`, { responseType: 'text' });
  }

  getTopUsersByPoints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-participacion`);
  }

  getUsersByPreferredLanguage(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-idioma`);
  }
}