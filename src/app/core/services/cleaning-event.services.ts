import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CleaningEvent } from '../models/cleaning-event';

@Injectable({ providedIn: 'root' })
export class CleaningEventService {
  private http = inject(HttpClient);
  // Apunta exactamente a tu @RequestMapping("/cleaning-events")
  private baseUrl = `${environment.base}/cleaning-events`; 

  // Endpoint: @GetMapping
  getAllEvents(): Observable<CleaningEvent[]> {
    return this.http.get<CleaningEvent[]>(this.baseUrl);
  }

  // Endpoint: @PostMapping("/nuevo") (Requiere rol BRIGADISTA o ADMIN)
  createEvent(eventData: Partial<CleaningEvent>): Observable<CleaningEvent> {
    return this.http.post<CleaningEvent>(`${this.baseUrl}/nuevo`, eventData);
  }

  // Endpoint: @DeleteMapping("/elimina/{id}")
  deleteEvent(idEvent: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/elimina/${idEvent}`, { responseType: 'text' });
  }
  
  joinEvent(idEvent: number, idUser: number): Observable<any> {
    // Mandamos un body vacío {} porque los datos ya viajan en la URL
    return this.http.post(`${this.baseUrl}/${idEvent}/unirse/${idUser}`, {}, { responseType: 'text' });
  }
}