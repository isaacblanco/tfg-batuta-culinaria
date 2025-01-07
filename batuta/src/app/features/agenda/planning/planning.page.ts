import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem,
  IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList,
  IonMenuButton, IonReorder, IonReorderGroup, IonTitle,
  IonToolbar, ToastController
} from '@ionic/angular/standalone';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { agendaDTO } from 'src/app/shared/models/agenda-DTO';

interface DayPlan {
  dayName: string;
  formattedDate: string;
  recipes: any[];
}

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonButton, IonButtons, IonMenuButton,
    IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemOptions, 
    IonItemOption, IonItemSliding, IonLabel, IonList,  
    IonReorder, IonReorderGroup, IonTitle, IonToolbar],
})
export class PlanningPage implements OnInit {
  agenda: agendaDTO = { user_id: '', data: [] };
  upcomingWeek: DayPlan[] = [];
  userId: string = '';
  clearShoppingListEnabled: boolean = true;
  
  private readonly daysOfWeek = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];
  
  private readonly monthsOfYear = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  constructor(
    private supabaseService: SupabaseService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.initializeData();
  }

  async ionViewWillEnter() {
    await this.refreshAgenda();
  }

  private async initializeData() {
    const userData = await this.supabaseService.getUser();
    if (userData) {
      this.userId = userData.id;
      await this.loadAgenda();
    }
  }

  // Indica si hay recetas en la agenda
  get hasRecipes(): boolean {
    return this.upcomingWeek.some(day => day.recipes.length > 0);
  }

  async loadAgenda() {
    try {
      const { data, error } = await this.supabaseService.client
        .from('agenda')
        .select('*')
        .eq('user_id', this.userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      this.agenda = data || { user_id: this.userId, data: [] };
      this.generateUpcomingWeek();
    } catch (error) {
      console.error('Error al cargar la agenda:', error);
      await this.showToast('Error al cargar la agenda.');
    }
  }

  private generateUpcomingWeek() {
    if (!this.agenda?.data) return;
    
    const today = new Date();
    this.upcomingWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      return {
        dayName: this.daysOfWeek[date.getDay()],
        formattedDate: this.formatDate(date),
        recipes: this.getRecipesForDate(date)
      };
    });
  }

  private formatDate(date: Date): string {
    return `${date.getDate()} de ${this.monthsOfYear[date.getMonth()]} de ${date.getFullYear()}`;
  }

  private getRecipesForDate(date: Date): any[] {
    return this.agenda.data.filter(item => {
      const agendaDate = new Date(item.date).toDateString();
      return agendaDate === date.toDateString();
    });
  }

  async deleteRecipeFromAgenda(recipe: { date: string; recipe_id: number; recipe_title: string }) {
    try {
      const updatedData = this.agenda.data.filter(
        item => item.recipe_id !== recipe.recipe_id || item.date !== recipe.date
      );

      await this.updateAgendaData(updatedData);
      await this.showToast('Receta eliminada de la agenda.');
    } catch (error) {
      console.error('Error al eliminar la receta:', error);
      await this.showToast('Error al eliminar la receta.');
    }
  }

  async moveIngredientsToShoppingList() {
    try {
      if (this.clearShoppingListEnabled) {
        await this.clearShoppingList();
      }
      await this.addIngredientsToShoppingList();
    } catch (error) {
      console.error('Error al procesar la lista de la compra:', error);
      await this.showToast('Error al procesar la lista de la compra.');
    }
  }

  private async clearShoppingList() {
    const { error } = await this.supabaseService.client
      .from('cesta')
      .delete()
      .eq('user_id', this.userId);

    if (error) throw error;
  }

  private async addIngredientsToShoppingList() {
    const shoppingList = this.generateShoppingList();
    
    if (shoppingList.length === 0) {
      await this.showToast('No hay recetas para añadir a la lista.');
      return;
    }

    const { error } = await this.supabaseService.client
      .from('cesta')
      .upsert({ 
        user_id: this.userId,
        shopping_list: shoppingList
      }, { onConflict: 'user_id' });

    if (error) throw error;
    await this.showToast('Ingredientes añadidos a la cesta de la compra.');
  }

  private generateShoppingList() {
    return this.upcomingWeek.flatMap(day =>
      day.recipes.map(recipe => ({
        recipe_id: recipe.recipe_id,
        recipe_name: recipe.recipe_title,
        multiplier: recipe.multiplier || 1,
        ingredients: recipe.ingredients.map((ingredient: any) => ({
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
      }))
    );
  }

  async reorderRecipes(event: any, day: DayPlan) {
    const [movedItem] = day.recipes.splice(event.detail.from, 1);
    day.recipes.splice(event.detail.to, 0, movedItem);
    event.detail.complete();
    
    await this.updateAgendaInDatabase();
  }

  async refreshAgenda() {
    try {
      await this.loadAgenda();
      await this.showToast('Agenda actualizada.');
    } catch (error) {
      console.error('Error al refrescar la agenda:', error);
      await this.showToast('Error al refrescar la agenda.');
    }
  }

  private async updateAgendaData(newData: any[]) {
    const { error } = await this.supabaseService.client
      .from('agenda')
      .update({ data: newData })
      .eq('user_id', this.userId);

    if (error) throw error;
    
    this.agenda.data = newData;
    this.generateUpcomingWeek();
  }

  private async updateAgendaInDatabase() {
    try {
      const updatedData = this.upcomingWeek.flatMap(day =>
        day.recipes.map(recipe => ({
          date: recipe.date,
          recipe_id: recipe.recipe_id,
          recipe_title: recipe.recipe_title,
        }))
      );

      await this.updateAgendaData(updatedData);
      await this.showToast('Agenda actualizada.');
    } catch (error) {
      console.error('Error al actualizar la agenda:', error);
      await this.showToast('Error al actualizar la agenda.');
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}