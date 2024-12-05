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
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Recipes', url: 'recipes', icon: 'book' },
    { title: 'Favorites', url: 'favorites', icon: 'heart' },
    { title: 'My Recipes', url: 'my-recipes', icon: 'book' },
    { title: 'New Recipe', url: 'new', icon: 'add' },
    { title: 'Shopping List', url: 'cart', icon: 'cart' },
    { title: 'Agenda', url: 'agenda', icon: 'calendar' },
  ];
  public labels = [];

  constructor(
    private router: Router,
    private menuController: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
    );
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
