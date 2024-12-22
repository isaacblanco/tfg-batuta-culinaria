import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Importa FormsModule
import { RouterLink } from '@angular/router';
import { IonButtons, IonContent, IonHeader, IonIcon, IonList, IonMenuButton, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { RecipeCardComponent } from 'src/app/shared/components/recipe-card/recipe-card.component';
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonContent,
    IonList,
    RecipeCardComponent,
    RouterLink,
    CommonModule,
    FormsModule
],
})
export class FavoritesPage implements OnInit {
  favorites: any[] = []; // Array para guardar los favoritos
  filteredFavorites: any[] = []; // Array filtrado para el buscador
  searchTerm: string = ''; // Término de búsqueda
  userId: string = ''; // ID del usuario

  constructor(
    private supabaseService: SupabaseService,
    private localStorageService: LocalStorageService
  ) {}

  async ngOnInit() {
    // Obtener ID del usuario desde el localStorage
    const userData = this.localStorageService.getUserData();
    if (userData) {
      this.userId = userData.id;
    }

    // Cargar los favoritos
    await this.loadFavorites();
  }

  async loadFavorites() {
    try {
      const data = await this.supabaseService.client
        .from('favoritos')
        .select('*, recetas(*)')
        .eq('user_id', this.userId);

      if (data.error) {
        console.error('Error al cargar favoritos:', data.error.message);
        return;
      }

      this.favorites = data.data || [];
      this.filteredFavorites = [...this.favorites]; // Inicialmente, todos los favoritos están filtrados
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  }

  // Método para filtrar favoritos por el término de búsqueda
  filterFavorites() {
    const term = this.searchTerm.toLowerCase();
    this.filteredFavorites = this.favorites.filter((favorite) =>
      favorite.recetas.name.toLowerCase().includes(term)
    );
  }
}
