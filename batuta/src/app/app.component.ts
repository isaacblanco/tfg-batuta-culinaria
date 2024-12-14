import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { AuthService } from './core/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonicModule],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false; // Actualizado automáticamente desde AuthService
  public appPages = [
    { title: 'Menu', url: 'home', icon: 'home' },
    { title: 'Recetas', url: 'recipes', icon: 'book' },
    { title: 'Favoritas', url: 'favorites', icon: 'heart' },
    { title: 'Mis recetas', url: 'my-recipes', icon: 'albums' },
    { title: 'Crear receta', url: 'new', icon: 'add-circle' },
    { title: 'IA', url: 'ia', icon: 'sparkles' },
    { title: 'Lista de la compra', url: 'cart', icon: 'cart' },
    { title: 'Agenda semanal', url: 'agenda', icon: 'calendar' },
  ];
  public labels = [];

  constructor(
    private router: Router,
    private menuController: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      if (!isAuthenticated) {
        this.menuController.enable(false); // Deshabilitar el menú
      } else {
        this.menuController.enable(true); // Habilitar el menú
      }
    });
  }

  async navigateTo(url: string): Promise<void> {
    await this.router.navigate([url]);
    await this.menuController.close();
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    this.authService.logout(); // Actualiza el estado de autenticación
    await this.menuController.close();
    this.router.navigate(['/login']); // Redirigir al login
  }
}
