import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { RecipeDTO } from 'src/app/shared/models/recipe-DTO';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class RecipePage implements OnInit {
  recipe: RecipeDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private navCtrl: NavController
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al cargar la receta:', error.message);
      } else {
        console.error('Error al cargar la receta:', String(error));
      }
    }
  }
}
