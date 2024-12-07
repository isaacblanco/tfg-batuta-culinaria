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
  shoppingList: any = null;
  localStorageIngredients: { name: string; quantity: number; unit: string }[] =  [];
  allIngredients: { name: string; quantity: number; unit: string; checked: boolean }[] = [];
  viewMode: 'recipe' | 'ingredients' = 'recipe';

  constructor(private shoppingCartService: ShoppingCartService, private localStorageService: LocalStorageService, private navCtrl: NavController) {}

  async ngOnInit() {
    const userId = this.localStorageService.getUserData()?.id;
    await this.shoppingCartService.initializeCart(userId);

    // Leer los datos desde el servicio de la cesta
    this.shoppingList = this.shoppingCartService.getCart(userId);
    if (this.shoppingList?.shopping_list?.length > 0) {
      this.aggregateIngredients();
    } else {
      this.shoppingList = { shopping_list: [] };
    }

    // Cargamos los ingredientes del local storage
    if ( localStorage.getItem('ingredients') !== null) {
      this.localStorageIngredients = JSON.parse(localStorage.getItem('ingredients') || '[]');
    } else {
      this.localStorageIngredients = [];
    }

    // Calculamos los ingredientes totales
    this.aggregateIngredients();
  }

  updateLocalStorage() {
    localStorage.setItem('ingredients', JSON.stringify(this.localStorageIngredients));
  }
  

  addLocalIngredient() {
    this.localStorageIngredients.push({
      name: '',
      quantity: 0,
      unit: '',
    });
    this.updateLocalStorage(); // Actualiza el localStorage
  }
  

  removeLocalIngredient(index: number) {
    this.localStorageIngredients.splice(index, 1);
    this.updateLocalStorage(); // Actualiza el localStorage
  }
  
 
  aggregateIngredients() {
    const ingredients: any = {};
    this.shoppingList.shopping_list.forEach((recipe: any) => {
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

  navigateBack() {
    this.navCtrl.back();
  }
}
