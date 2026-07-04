import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../core/services/user.services';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-top',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './top-users.html',
  styleUrls: ['./top-users.css']
})
export class UserTopComponent implements OnInit {
  private userService = inject(UserService);

  topUsers: any[] = [];

  ngOnInit() {
    this.loadTopUsers();
  }

  loadTopUsers() {
    this.userService.getTopCitizensByPoints().subscribe({
      next: (data) => {
        // Como el backend devuelve DTOs completos, no necesitamos hacer conversiones matemáticas
        console.log('Respuesta del Backend (Ranking):', data);
        this.topUsers = data;
      },
      error: (err) => console.error('Error al cargar el top de usuarios:', err)
    });
  }
}