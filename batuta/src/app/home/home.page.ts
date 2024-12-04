import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonToolbar, CommonModule, FormsModule, IonicModule],
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToRecipes() {
    this.router.navigate(['/recipes']);
  }

  navigateToFavorites() {
    this.router.navigate(['/favorites']);
  }

  navigateToMyRecipes() {
    this.router.navigate(['/my-recipes']);
  }

  navigateToNewRecipe() {
    this.router.navigate(['/new']);
  }

  navigateToShoppingList() {
    this.router.navigate(['/shopping-list']);
  }

  navigateToAgenda() {
    this.router.navigate(['/agenda']);
  }

  navigateToIA() {
    this.router.navigate(['/ia']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }
}
