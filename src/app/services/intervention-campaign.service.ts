import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InterventionCampaign } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class InterventionCampaignService {
  private apiUrl = `${environment.apiUrl}/campanas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<InterventionCampaign[]> {
    return this.http.get<InterventionCampaign[]>(this.apiUrl);
  }

  getById(id: number): Observable<InterventionCampaign> {
    return this.http.get<InterventionCampaign>(`${this.apiUrl}/${id}`);
  }

  create(campaign: InterventionCampaign): Observable<InterventionCampaign> {
    return this.http.post<InterventionCampaign>(`${this.apiUrl}/nuevo`, campaign);
  }

  update(campaign: InterventionCampaign): Observable<InterventionCampaign> {
    return this.http.put<InterventionCampaign>(`${this.apiUrl}/actualiza`, campaign);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/elimina/${id}`, { responseType: 'text' });
  }

  searchByDistrictName(districtName: string): Observable<InterventionCampaign[]> {
    return this.http.get<InterventionCampaign[]>(`${this.apiUrl}/buscar-por-distrito`, { params: new HttpParams().set('districtName', districtName) });
  }

  getCampaignsByType(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-tipo`);
  }

  getCampaignsInTimeframe(inicio: string, fin: string): Observable<any[]> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<any[]>(`${this.apiUrl}/por-lapso-tiempo`, { params });
  }
}