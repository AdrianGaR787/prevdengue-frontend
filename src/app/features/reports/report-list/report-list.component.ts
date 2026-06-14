import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ReportService } from '../../../services/report.service'; // Tu servicio
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule], // Importante importar MatTableModule aquí
  templateUrl: './report-list.html',
  styleUrls: ['./report-list.scss']
})
export class ReportListComponent implements OnInit {
  displayedColumns: string[] = ['idReport', 'description', 'reportDate', 'coordinates', 'status'];
  dataSource: any[] = []; // O usa MatTableDataSource

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getAll().subscribe({
      next: (data) => this.dataSource = data,
      error: (err) => console.error(err)
    });
  }
}