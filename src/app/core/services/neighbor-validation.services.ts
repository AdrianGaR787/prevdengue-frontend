import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { NeighborValidation } from '../models/neighbor-validation';

@Injectable({ providedIn: 'root' })
export class NeighborValidationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.base}/validacion-vecinal`; // Apunta a tu @RequestMapping

  // Obtener todas las validaciones (útil para analítica)
  getAllValidations(): Observable<NeighborValidation[]> {
    return this.http.get<NeighborValidation[]>(this.baseUrl);
  }

  // Enviar un nuevo voto / validación vecinal
  registerValidation(dto: Partial<NeighborValidation>): Observable<NeighborValidation> {
    return this.http.post<NeighborValidation>(`${this.baseUrl}/nuevo`, dto);
  }
}