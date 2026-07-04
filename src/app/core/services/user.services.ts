import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { JwtRequestDTO, JwtResponseDTO } from '../models/Auth'; // Crea estas interfaces
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.base}/usuarios`;

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.url}/nuevo`, user,{responseType: 'text' });
  }
  list(): Observable<any[]>{
    return this.http.get<any[]>(this.url);
  }
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }
  update(user: any): Observable<any> {
    return this.http.put(`${this.url}/actualiza`, user);
  }
  delete(id: number): Observable<any> {
    // Usamos 'text' como responseType por si tu backend devuelve un String en vez de un JSON
    return this.http.delete(`${this.url}/elimina/${id}`, { responseType: 'text' });
  }
  insert(user: any): Observable<any> { //añadir un nuevo usuario solo desde el panel de usuarios del admin
    return this.http.post(`${this.url}/nuevo`, user, { responseType: 'text' });
  }
}
