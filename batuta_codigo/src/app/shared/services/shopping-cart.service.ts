import { Injectable } from '@angular/core';
import { cartDTO } from '../models/cart-DTO';
import { SupabaseService } from './../../core/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private cart: cartDTO | null = null;

  constructor(private supabaseService: SupabaseService) {}

  async initializeCart(userId: string) {
    try {
      const { data, error } = await this.supabaseService.client
        .from('cesta')
        .select('shopping_list')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No cart exists, create a new one
        const newCart: cartDTO = {
          user_id: userId,
          shopping_list: [],
        };
        const { error: insertError } = await this.supabaseService.client
          .from('cesta')
          .insert(newCart);

        if (insertError) {
          throw new Error('Error al crear una nueva lista de la compra.');
        }
        this.cart = newCart;
      } else if (data) {
        this.cart = {
          user_id: userId,
          shopping_list: data.shopping_list || [],
        };
      }
    } catch (error) {
      console.error('Error al inicializar la lista de la compra:', error);
    }
  }

  async getCart(userId: string): Promise<cartDTO | null> {
    if (!this.cart) {
      await this.initializeCart(userId);
    }
    return this.cart;
  }

  async addRecipeToCart(userId: string, recipe: any) {
    await this.initializeCart(userId);

    const existingRecipe = this.cart?.shopping_list.find(
      (item) => item.recipe_id === recipe.id
    );

    if (existingRecipe) {
      existingRecipe.multiplier += 1;
    } else {
      this.cart?.shopping_list.push({
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        multiplier: 1,
        ingredients: recipe.ingredients,
      });
    }

    await this.updateCartInDatabase();
  }

  async updateMultiplier(userId: string, recipeId: number, delta: number) {
    await this.initializeCart(userId);

    const existingRecipe = this.cart?.shopping_list.find(
      (item) => item.recipe_id === recipeId
    );

    if (existingRecipe) {
      existingRecipe.multiplier += delta;

      if (existingRecipe.multiplier <= 0) {
        if (this.cart?.shopping_list) {
          this.cart.shopping_list = this.cart.shopping_list.filter(
            (item) => item.recipe_id !== recipeId
          );
        }
      }

      await this.updateCartInDatabase();
    }
  }

  private async updateCartInDatabase() {
    if (!this.cart) return;

    try {
      const { error } = await this.supabaseService.client
        .from('cesta')
        .update({ shopping_list: this.cart.shopping_list })
        .eq('user_id', this.cart.user_id);

      if (error) {
        throw new Error('Error al actualizar la lista de la compra.');
      }
    } catch (error) {
      // console.error('Error al actualizar la lista de la compra:', error);
    }
  }

  // Nuevo método para eliminar todos los ingredientes de la tabla `cesta` para un usuario
  async clearCart(userId: string): Promise<void> {
    try {
      const { error } = await this.supabaseService.client
        .from('cesta')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new Error('Error al vaciar la lista de la compra.');
      }

      // Limpiar la referencia local del carrito
      this.cart = { user_id: userId, shopping_list: [] };
      // console.log('Lista de la compra vaciada con éxito.');
    } catch (error) {
      console.error('Error al vaciar la lista de la compra:', error);
      throw error;
    }
  }

  getLocalStorageItems(): { name: string; quantity: number; unit: string }[] {
    return JSON.parse(localStorage.getItem('ingredients') || '[]');
  }

  addLocalStorageItem(ingredient: { name: string; quantity: number; unit: string }) {
    const items = this.getLocalStorageItems();
    items.push(ingredient);
    localStorage.setItem('ingredients', JSON.stringify(items));
  }
}
