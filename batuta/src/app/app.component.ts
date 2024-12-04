import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonicModule],
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
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
  constructor(private router: Router) {}

  ngOnInit() {
    this.isAuthenticated = false;
  }

  /**
   * Realiza logout del usuario
   */
  logout() {
    this.isAuthenticated = false;
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
