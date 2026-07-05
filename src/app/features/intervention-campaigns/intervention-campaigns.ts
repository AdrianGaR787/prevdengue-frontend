import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { InterventionCampaignService } from '../../core/services/intervention-campaign-service';
import { InterventionCampaign } from '../../core/models/intervention-campaign';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InterventionCampaignInsertComponent } from '../intervention-campaigns/intervention-campaign-insert/intervention-campaign-insert';

@Component({
  selector: 'app-intervention-campaigns',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './intervention-campaigns.html',
  styleUrls: ['./intervention-campaigns.css']
})
export class InterventionCampaignsComponent implements OnInit {
  private campaignService = inject(InterventionCampaignService);
  private dialog = inject(MatDialog);
  
  campaigns: InterventionCampaign[] = [];

  ngOnInit() {
    this.cargarCampanas();
  }
  abrirDialogoCreacion() {
    const dialogRef = this.dialog.open(InterventionCampaignInsertComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        setTimeout(() => this.cargarCampanas(), 300); // Recarga automática
      }
    });
  } 

  cargarCampanas() {
    this.campaignService.getAllCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        console.log('Campañas cargadas:', this.campaigns);
      },
      error: (err) => console.error('Error cargando campañas:', err)
    });
  }

  // Funcionalidad para determinar si una campaña está activa basada en las fechas
  getEstadoCampana(fechaInicio: string, fechaFin: string): { texto: string, color: string } {
    const hoy = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (hoy < inicio) return { texto: 'PROGRAMADA', color: 'primary' };
    if (hoy >= inicio && hoy <= fin) return { texto: 'EN CURSO', color: 'accent' };
    return { texto: 'FINALIZADA', color: 'warn' };
  }
}