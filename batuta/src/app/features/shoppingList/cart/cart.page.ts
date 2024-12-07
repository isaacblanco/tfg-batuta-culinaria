import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UNITS } from 'src/app/shared/enums/units';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CartPage implements OnInit {
  units = UNITS;
  cart: any = null;
  localStorageIngredients: { name: string; quantity: number; unit: string }[] =  [];
  allIngredients: { name: string; quantity: number; unit: string; checked: boolean }[] = [];
  viewMode: 'recipe' | 'ingredients' = 'recipe';

  constructor(private shoppingCartService: ShoppingCartService, private localStorageService: LocalStorageService, private navCtrl: NavController) {}

  async ngOnInit() {
    const userId = this.localStorageService.getUserId();
    await this.shoppingCartService.initializeCart(userId);
  
    // Resolver la Promise correctamente
    this.cart = await this.shoppingCartService.getCart(userId);
  
    if (this.cart?.shopping_list?.length > 0) {
      this.aggregateIngredients();
    } else {
      this.cart = { shopping_list: [] };
    }
  
    // Cargar ingredientes del Local Storage
    if (localStorage.getItem('ingredients') !== null) {
      this.localStorageIngredients = JSON.parse(localStorage.getItem('ingredients') || '[]');
    } else {
      this.localStorageIngredients = [];
    }
  }
  

  // Actualiza el localStorage
  updateLocalStorage() {
    localStorage.setItem('ingredients', JSON.stringify(this.localStorageIngredients));
  }
  
  // Añade un ingrediente al localStorage
  addLocalIngredient() {
    this.localStorageIngredients.push({
      name: '',
      quantity: 0,
      unit: '',
    });
    this.updateLocalStorage(); // Actualiza el localStorage
  }

  // Elimina un ingrediente del localStorage
  removeLocalIngredient(index: number) {
    this.localStorageIngredients.splice(index, 1);
    this.updateLocalStorage(); // Actualiza el localStorage
  }
   
  // Calcula los ingredientes totales
  aggregateIngredients() {
    const ingredients: any = {};

    this.cart.shopping_list.forEach((recipe: any) => {
      recipe.ingredients.forEach((ingredient: any) => {
        const key = `${ingredient.name}-${ingredient.unit}`;
        if (ingredients[key]) {
          ingredients[key].quantity += ingredient.quantity * recipe.multiplier;
        } else {
          ingredients[key] = { ...ingredient, quantity: ingredient.quantity * recipe.multiplier, checked: false };
        }
      });
    });
    this.allIngredients = Object.values(ingredients);
  }

  // Navega hacia atrás
  navigateBack() {
    this.navCtrl.back();
  }
}
