import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IonButtons, IonContent, IonHeader, IonIcon, IonList, IonMenuButton, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { RecipeCardComponent } from 'src/app/shared/components/recipe-card/recipe-card.component';
import { RecipeFilterPipe } from 'src/app/shared/pipes/recipe-filter.pipe';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [
    RecipeCardComponent,
    IonTitle, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonIcon, IonContent, IonList, IonSearchbar,
    CommonModule,
    FormsModule,
    RouterLink,
    RecipeFilterPipe,
  ],
})
export class ListPage implements OnInit {
  recipes: any[] = [];
  searchTerm: string = '';
  filteredRecipes: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  async loadRecipes() {
    try {
      this.recipes = await this.supabaseService.getRecipes();
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
