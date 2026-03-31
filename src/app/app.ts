import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModules } from './shared/material.providers';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MaterialModules, // 3. Agrégalo aquí
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('WorkScan-Front');
}
