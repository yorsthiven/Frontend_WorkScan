import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModules } from './shared/material.providers';
import { Navbar } from './components/shared/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModules],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('WorkScan-Front');
}
