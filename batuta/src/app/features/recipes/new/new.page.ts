import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { UNITS } from 'src/app/shared/enums/units';

interface Recipe {
  name: string;
  preparation_time: string;
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  steps: Array<{
    duration: number;
    instructions: string;
    durationUnit: string;
  }>;
  labels: string;
  difficulty: number;
  category_id: number;
  num_people: number;
  image_url: string;
  user_id?: string;
}

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink],
})
export class NewPage implements OnInit {
  units = UNITS;
  recipeId: string | null = null;
  userId: string = '';
  categories: Array<{ id: number; name: string }> = [];

  recipe: Recipe = {
    name: 'Demo',
    preparation_time: '00:30:00',
    ingredients: [{ name: 'uno', quantity: '1', unit: 'grs' }],
    steps: [{ duration: 3, instructions: 'Paso 1', durationUnit: 'minutes' }],
    labels: 'Pasta, Salado',
    difficulty: 1,
    category_id: 1,
    num_people: 1,
    image_url: 'https://www.isaacblanco.com/UOC/TFG/no-image.jpg',
  };

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    const userData = this.localStorageService.getUserData();
    if (userData) {
      this.userId = userData.id;
    }

    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.loadRecipe(this.recipeId);
    }

    this.loadCategories();
  }

  async loadCategories() {
    try {
      const data = await this.supabaseService.selectFromTable(
        'categorias',
        '*'
      );
      this.categories = data.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  async loadRecipe(id: string) {
    try {
      const recipe = await this.supabaseService.readSingle<Recipe>('recetas', {
        id,
      });
      if (recipe.user_id !== this.userId) {
        alert('No tienes permiso para editar esta receta.');
        return;
      }

      this.recipe = {
        ...this.recipe,
        ...recipe,
      };
    } catch (error: any) {
      console.error('Error al cargar la receta:', error.message || error);
    }
  }

  async saveRecipe() {
    const payload = { ...this.recipe, user_id: this.userId };

    try {
      if (this.recipeId) {
        await this.supabaseService.insertIntoTable('recetas', payload);
      } else {
        const existingRecipe = await this.supabaseService.selectFromTable(
          'recetas',
          '*'
        );
        const match = existingRecipe.find((r: any) => r.id === this.recipeId);

        if (match) {
          await this.supabaseService.insertIntoTable('recetas', payload);
        } else {
          await this.supabaseService.insertIntoTable('recetas', payload);
        }
      }

      alert('Receta guardada con éxito.');
    } catch (error: any) {
      console.error('Error al guardar la receta:', error.message || error);
    }
  }

  addIngredient() {
    this.recipe.ingredients.push({ name: '', quantity: '', unit: '' });
  }

  removeIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }

  addStep() {
    this.recipe.steps.push({
      duration: 1,
      instructions: '',
      durationUnit: 'minutes',
    });
  }

  removeStep(index: number) {
    this.recipe.steps.splice(index, 1);
  }

  isFormValid(): boolean {
    return (
      !!this.recipe.name &&
      !!this.recipe.preparation_time &&
      this.recipe.ingredients.every(
        (ing) => !!ing.name && !!ing.quantity && !!ing.unit
      ) &&
      this.recipe.steps.every((step) => !!step.duration && !!step.instructions)
    );
  }
}
