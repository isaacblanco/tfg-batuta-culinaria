import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { agendaDTO } from 'src/app/shared/models/agenda-DTO';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class PlanningPage implements OnInit {
  agenda: agendaDTO | null = null;
  upcomingWeek: { dayName: string; formattedDate: string; recipes: any[] }[] =
    [];
  futureRecipes: { date: string; recipe_id: number; recipe_title: string }[] =
    [];
  userId: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const userData = await this.supabaseService.getUser();
    if (userData) {
      this.userId = userData.id;
      await this.loadAgenda();
    }

    this.generateUpcomingWeek();
    this.filterFutureRecipes();
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

      const recipes =
        this.agenda?.data.filter(
          (item) =>
            new Date(item.date).toDateString() === date.toDateString()
        ) || [];

      this.upcomingWeek.push({ dayName, formattedDate, recipes });
    }
  }

  filterFutureRecipes() {
    const today = new Date();

    this.futureRecipes =
      this.agenda?.data.filter(
        (item) =>
          new Date(item.date).getTime() > today.getTime() + 7 * 24 * 60 * 60 * 1000
      ) || [];
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
        this.filterFutureRecipes();
        this.showToast('Receta eliminada de la agenda.');
      }
    } catch (error) {
      console.error('Error al eliminar la receta de la agenda:', error);
      this.showToast('Error al eliminar la receta de la agenda.');
    }
  }

  async moveIngredientsToShoppingList() {
    try {
      // Recorremos las recetas de la agenda semanal
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
  
      // Lógica para mover los ingredientes a la cesta de la compra
      if (ingredients.length === 0) {
        console.log('No hay ingredientes para mover a la cesta de la compra.');
        return;
      }
  
      // Llamada al servicio para añadir los ingredientes a la lista de la compra
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
  
}
