import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // si estás usando Angular standalone
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'] // plural y array
})
export class App {
  title = 'PrevDengue Frontend'; // agrega la propiedad
}
