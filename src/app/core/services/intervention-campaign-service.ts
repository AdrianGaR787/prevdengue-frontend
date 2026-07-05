import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { InterventionCampaign } from '../models/intervention-campaign';

@Injectable({ providedIn: 'root' })
export class InterventionCampaignService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.base}/campanas`; // 🚀 Apunta a tu @RequestMapping

  getAllCampaigns(): Observable<InterventionCampaign[]> {
    return this.http.get<InterventionCampaign[]>(this.baseUrl);
  }

  createCampaign(campaignData: any): Observable<InterventionCampaign> {
    return this.http.post<InterventionCampaign>(`${this.baseUrl}/nuevo`, campaignData);
  }

  deleteCampaign(idCampana: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/elimina/${idCampana}`, { responseType: 'text' });
  }

  searchByDistrict(districtName: string): Observable<InterventionCampaign[]> {
    const params = new HttpParams().set('districtName', districtName);
    return this.http.get<InterventionCampaign[]>(`${this.baseUrl}/buscar-por-distrito`, { params });
  }
}