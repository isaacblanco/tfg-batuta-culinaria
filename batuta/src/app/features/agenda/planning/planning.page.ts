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
  agenda: agendaDTO | null = null;
  upcomingWeek: { dayName: string; formattedDate: string; recipes: any[] }[] =
    [];
  
  userId: string = '';
  clearShoppingListEnabled: boolean = true; // Checkbox state


  constructor(
    private supabaseService: SupabaseService,
  private toastController: ToastController  ) {}

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
  
    // console.log('Generated upcoming week:', this.upcomingWeek);
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
        .from('cesta')
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
      // Generar la lista de recetas y sus ingredientes
      const shoppingList = this.upcomingWeek.flatMap(day =>
        day.recipes.map(recipe => ({
          recipe_id: recipe.recipe_id,
          recipe_name: recipe.recipe_title,
          multiplier: recipe.multiplier || 1, // Asume un multiplicador de 1 si no está definido
          ingredients: recipe.ingredients.map((ingredient: any) => ({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })),
        }))
      );
  
      if (shoppingList.length === 0) {
        console.log('No hay recetas o ingredientes para mover a la lista de la compra.');
        return;
      }
  
      // Preparar el objeto para guardar en la base de datos
      const payload = {
        user_id: this.userId,
        shopping_list: shoppingList,
      };
  
      // Guardar o actualizar en la base de datos
      const { error } = await this.supabaseService.client
        .from('cesta')
        .upsert(payload, { onConflict: 'user_id' });
  
      if (error) {
        console.error('Error al guardar la lista de la compra:', error);
        return;
      }
  
      console.log('Lista de la compra guardada con éxito:', shoppingList);
      this.showToast('Ingredientes añadidos a la cesta de la compra.');
    } catch (error) {
      console.error('Error al mover ingredientes a la lista de la compra:', error);
    }
  }
  

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
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
  

  // Recargamos los datos
// Recargamos los datos
async refreshAgenda() {
  try {
    await this.loadAgenda(); // Carga la nueva agenda
    this.upcomingWeek = []; // Limpia la semana generada previamente
    this.generateUpcomingWeek(); // Genera los datos nuevamente
    console.log('Agenda refrescada con éxito.');
    this.showToast('Agenda actualizada.');
  } catch (error) {
    console.error('Error al refrescar la agenda:', error);
    this.showToast('Error al refrescar la agenda.');
  }
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
