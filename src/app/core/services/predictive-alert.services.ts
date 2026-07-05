import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { PredictiveAlertDTO } from '../models/predictive-alert';

@Injectable({ providedIn: 'root' })
export class PredictiveAlertService {
  private http = inject(HttpClient);
  // 🚀 Ajusta la URL según el @RequestMapping de tu controlador en Spring Boot
  private baseUrl = `${environment.base}/alertas-predictivas`; 

  getAllAlerts(): Observable<PredictiveAlertDTO[]> {
    return this.http.get<PredictiveAlertDTO[]>(this.baseUrl);
  }
}