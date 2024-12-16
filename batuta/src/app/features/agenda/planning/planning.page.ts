import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonListHeader, IonMenuButton, IonReorder, IonReorderGroup, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { agendaDTO } from 'src/app/shared/models/agenda-DTO';
@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonButton, IonButtons, IonMenuButton,IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemOptions, IonItemOption, IonItemSliding, IonLabel, IonList, IonListHeader, IonReorder, IonReorderGroup, IonTitle, IonToolbar],
})
export class PlanningPage implements OnInit {
  agenda: agendaDTO | null = null;
  upcomingWeek: { dayName: string; formattedDate: string; recipes: any[] }[] =
    [];
  
  userId: string = '';
  clearShoppingListEnabled: boolean = true; // Checkbox state


  constructor(
    private supabaseService: SupabaseService  ) {}

  async ngOnInit() {
    const userData = await this.supabaseService.getUser();
    if (userData) {
      this.userId = userData.id;
      await this.loadAgenda();
    }

    this.generateUpcomingWeek();
    
  }

  async loadAgenda() {
    try {
      const { data, error } = await this.supabaseService.client
        .from('agenda')
        .select('*')
        .eq('user_id', this.userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error al cargar la agenda:', error.message);
        return;
      }

      this.agenda = data || { user_id: this.userId, data: [] };
    } catch (error) {
      console.error('Error al cargar la agenda:', error);
      this.showToast('Error al cargar la agenda.');
    }
  }

  generateUpcomingWeek() {
    if (!this.agenda || !this.agenda.data) {
      console.warn('No agenda data available.');
      return;
    }
  
    const today = new Date();
    const daysOfWeek = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const monthsOfYear = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
  
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
  
      const dayName = daysOfWeek[date.getDay()];
      const formattedDate = `${date.getDate()} de ${
        monthsOfYear[date.getMonth()]
      } de ${date.getFullYear()}`;
  
      // Filtrar recetas por fecha
      const recipes =
        this.agenda.data.filter((item) => {
          const agendaDate = new Date(item.date).toDateString();
          const targetDate = date.toDateString();
          return agendaDate === targetDate;
        }) || [];
  
      this.upcomingWeek.push({ dayName, formattedDate, recipes });
    }
  
    console.log('Generated upcoming week:', this.upcomingWeek);
  }
  


  async deleteRecipeFromAgenda(recipe: {
    date: string;
    recipe_id: number;
    recipe_title: string;
  }) {
    try {
      const agendaData = this.agenda?.data.filter(
        (item) => item.recipe_id !== recipe.recipe_id || item.date !== recipe.date
      );
  
      if (agendaData) {
        await this.supabaseService.client
          .from('agenda')
          .update({ data: agendaData })
          .eq('user_id', this.userId);
  
        this.agenda!.data = agendaData;
  
        // Regenerar la lista de la semana
        this.upcomingWeek = [];
        this.generateUpcomingWeek();
  
        this.showToast('Receta eliminada de la agenda.');
      }
    } catch (error) {
      console.error('Error al eliminar la receta de la agenda:', error);
      this.showToast('Error al eliminar la receta de la agenda.');
    }
  }
  

  async moveIngredientsToShoppingList() {
    try {
      if (this.clearShoppingListEnabled) {
        await this.clearShoppingList();
      }
      await this.addIngredientsToShoppingList();
    } catch (error) {
      console.error('Error al mover ingredientes a la lista de la compra:', error);
    }
  }

  private async clearShoppingList() {
    try {
      const { error } = await this.supabaseService.client
        .from('shopping_list')
        .delete()
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error al limpiar la lista de la compra:', error);
        return;
      }

      console.log('Cesta de la compra limpiada con éxito.');
    } catch (error) {
      console.error('Error al limpiar la lista de la compra:', error);
    }
  }

  private async addIngredientsToShoppingList() {
    try {
      const ingredients: { name: string; quantity: number; unit: string }[] = [];

      this.upcomingWeek.forEach(day => {
        day.recipes.forEach(recipe => {
          if (recipe.ingredients) {
            recipe.ingredients.forEach((ingredient: any) => {
              const existing = ingredients.find(
                ing => ing.name === ingredient.name && ing.unit === ingredient.unit
              );
              if (existing) {
                existing.quantity += ingredient.quantity;
              } else {
                ingredients.push({ ...ingredient });
              }
            });
          }
        });
      });

      if (ingredients.length === 0) {
        console.log('No hay ingredientes para mover a la cesta de la compra.');
        return;
      }

      const { error } = await this.supabaseService.client
        .from('shopping_list')
        .insert({ user_id: this.userId, items: ingredients });

      if (error) {
        console.error('Error al mover los ingredientes a la lista de la compra:', error);
        return;
      }

      console.log('Ingredientes movidos a la lista de la compra:', ingredients);
      this.showToast('Ingredientes añadidos a la cesta de la compra.');
    } catch (error) {
      console.error('Error al mover ingredientes a la lista de la compra:', error);
    }
  }

  async showToast(message: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    document.body.appendChild(toast);
    return toast.present();
  }
  
  async reorderRecipes(event: any, day: { dayName: string; formattedDate: string; recipes: any[] }) {
    const fromIndex = event.detail.from;
    const toIndex = event.detail.to;
  
  // Mueve la receta dentro del mismo día
  const movedRecipe = day.recipes.splice(fromIndex, 1)[0];
  day.recipes.splice(toIndex, 0, movedRecipe);

  event.detail.complete();

  // Actualiza la agenda en la base de datos
  await this.updateAgendaInDatabase();
  }
  
  private calculateTargetDayIndex(toIndex: number, currentDayIndex: number): number {
    let cumulativeIndex = 0;
  
    for (let i = 0; i < this.upcomingWeek.length; i++) {
      if (i === currentDayIndex) continue;
  
      const recipesCount = this.upcomingWeek[i].recipes.length;
      if (toIndex >= cumulativeIndex && toIndex < cumulativeIndex + recipesCount) {
        return i;
      }
  
      cumulativeIndex += recipesCount;
    }
  
    return currentDayIndex;
  }
  
  private async updateAgendaInDatabase() {
    try {
      const updatedAgendaData: { date: string; recipe_id: number; recipe_title: string }[] = [];
  
      // Recolecta los datos actualizados de la agenda
      this.upcomingWeek.forEach((day) => {
        day.recipes.forEach((recipe) => {
          updatedAgendaData.push({
            date: recipe.date,
            recipe_id: recipe.recipe_id,
            recipe_title: recipe.recipe_title,
          });
        });
      });
  
      // Actualiza la agenda en la base de datos
      const { error } = await this.supabaseService.client
        .from('agenda')
        .update({ data: updatedAgendaData })
        .eq('user_id', this.userId);
  
      if (error) {
        console.error('Error al actualizar la agenda:', error);
        this.showToast('Error al actualizar la agenda.');
      } else {
        this.showToast('Agenda actualizada.');
      }
    } catch (error) {
      console.error('Error al actualizar la agenda:', error);
      this.showToast('Error al actualizar la agenda.');
    }
  }

}
