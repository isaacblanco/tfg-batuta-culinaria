import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonButtons, IonContent, IonHeader, IonIcon, IonList, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { RecipeCardComponent } from 'src/app/shared/components/recipe-card/recipe-card.component';
import { RecipeFilterPipe } from 'src/app/shared/pipes/recipe-filter.pipe';
@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.page.html',
  styleUrls: ['./my-recipes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RecipeFilterPipe,
    RecipeCardComponent,
    IonTitle, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonIcon, IonContent, IonList
  ],
})
export class MyRecipesPage implements OnInit {
  recipes: any[] = [];
  searchTerm: string = '';
  filteredRecipes: any[] = [];
  userId: string;

  constructor(
    private supabaseService: SupabaseService,
    private localStorageService: LocalStorageService
  ) {
    this.userId = this.localStorageService.getUserId();
  }

  ngOnInit() {
    this.loadRecipes();
  }

  async loadRecipes() {
    try {
      this.recipes = await this.supabaseService.getMyRecipes(this.userId);
    } catch (error) {
      console.error('Error al cargar las recetas:', error);
    }
  }

  filterRecipes() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRecipes = this.recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(term)
    );
  }
}
