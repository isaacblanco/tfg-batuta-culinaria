import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { RecipeDTO } from 'src/app/shared/models/recipe-DTO';
import { timeFormat } from 'src/app/shared/utils/dateTime-utils';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class RecipePage implements OnInit {
  recipe: RecipeDTO | null = null;
  duration: string = '';
  favorite: boolean = false;
  userId: string = ''; // ID del usuario autenticado

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  async ngOnInit() {
    const userData = await this.supabaseService.getUser();
    if (userData) {
      this.userId = userData.id;
    }

    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      await this.loadRecipe(parseInt(recipeId, 10));
      await this.checkIfFavorite();
    }
  }

  navigateBack() {
    this.navCtrl.back();
  }

  async loadRecipe(id: number) {
    try {
      const data = await this.supabaseService.readSingleById<RecipeDTO>(
        'recetas',
        id
      );
      this.recipe = data;
      this.duration = timeFormat(data.preparation_time);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al cargar la receta:', error.message);
      } else {
        console.error('Error al cargar la receta:', String(error));
      }
    }
  }

  async checkIfFavorite() {
    if (!this.recipe || !this.userId) {
      return;
    }
    try {
      const { data, error } = await this.supabaseService.client
        .from('favoritos')
        .select('*')
        .eq('user_id', this.userId)
        .eq('recipe_id', this.recipe.id);

      if (error) {
        console.error(
          'Error al comprobar si la receta está en favoritos:',
          error.message
        );
        return;
      }

      this.favorite = (data && data.length > 0) || false;
    } catch (error) {
      console.error('Error al comprobar favoritos:', error);
    }
  }

  async addToFavorites() {
    if (!this.recipe || !this.userId) {
      console.warn(
        'No se pudo agregar a favoritos: receta o usuario no disponibles.'
      );
      return;
    }
    try {
      const { data, error } = await this.supabaseService.client
        .from('favoritos')
        .insert([{ user_id: this.userId, recipe_id: this.recipe.id }]);

      if (error) {
        console.error('Error al añadir a favoritos:', error.message);
        return;
      }

      console.log('Receta añadida a favoritos:', data);
      this.favorite = true;
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
    }
  }

  async removeFromFavorites() {
    if (!this.recipe || !this.userId) {
      console.warn(
        'No se pudo eliminar de favoritos: receta o usuario no disponibles.'
      );
      return;
    }
    try {
      const { error } = await this.supabaseService.client
        .from('favoritos')
        .delete()
        .eq('user_id', this.userId)
        .eq('recipe_id', this.recipe.id);

      if (error) {
        console.error('Error al eliminar de favoritos:', error.message);
        return;
      }

      console.log('Receta eliminada de favoritos.');
      this.favorite = false;
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
    }
  }

  addToAgenda() {
    console.log('Añadir a la agenda:', this.recipe);
  }

  addToShoppingList() {
    console.log('Añadir a la lista de la compra:', this.recipe);
  }

  duplicateRecipe() {
    console.log('Duplicar receta:', this.recipe);
    // Implementa la lógica para duplicar la receta
  }

  editRecipe() {
    console.log('Editar receta:', this.recipe);
    if (this.recipe) {
      this.router.navigate(['/edit', this.recipe.id]);
    }
  }
}
