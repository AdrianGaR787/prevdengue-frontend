import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.services';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}