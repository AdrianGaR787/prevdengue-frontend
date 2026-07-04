import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select'; // Necesario para mat-select
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, 
    MatInputModule, 
    MatCardModule, 
    MatSelectModule, 
    FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  user = {
    name: '',
    email: '',
    phone: '',
    passwordHash: '',
    preferredLanguage: 'ES'
  };
  onRegister() {
    console.log('Datos de registro:', this.user);
    // Aquí luego llamarás a tu servicio de autenticación
  }
}
