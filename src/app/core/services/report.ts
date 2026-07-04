import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ReportDTO } from '../models/Report';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private url = `${environment.base}/reportes`; // Apunta al @RequestMapping("/reportes")

  // Método equivalente al @GetMapping de tu Spring Boot
  list(): Observable<ReportDTO[]> {
    return this.http.get<ReportDTO[]>(this.url);
  }
  // Método equivalente al @PostMapping("/nuevo") de tu Spring Boot
  insert(report: ReportDTO) {
    return this.http.post<ReportDTO>(`${this.url}/nuevo`, report);
  }
  update(report: any): Observable<any> {
    return this.http.put(`${this.url}/actualiza`, report);
  }
  delete(id: number):Observable<any> {
    return this.http.delete(`${this.url}/elimina/${id}`,{ responseType: 'text' }); 
  }
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }
}