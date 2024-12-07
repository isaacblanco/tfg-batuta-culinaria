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

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.loadRecipe(parseInt(recipeId, 10));
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

  addToAgenda() {}

  removeFromFavorites() {
    console.log('Eliminar de favoritos:', this.recipe);
  }

  addToFavorites() {
    console.log('Añadir a favoritos:', this.recipe);
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
