import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
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
  userId: string = '';
  weekDays: { label: string; dayIndex: number }[] = []; // Botones con los días de la semana


  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private navCtrl: NavController,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const userData = await this.supabaseService.getUser();
    if (userData) {
      this.userId = userData.id;
    }

    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      await this.loadRecipe(parseInt(recipeId, 10));
      await this.checkIfFavorite();
    }

    this.generateWeekDays();
  }

  navigateBack() {
    this.navCtrl.back();
  }

  generateWeekDays() {
    const today = new Date();
    const daysOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.weekDays.push({
        label: daysOfWeek[date.getDay()],
        dayIndex: i,
      });
    }
  }

  async loadRecipe(id: number) {
    try {
      const data = await this.supabaseService.readSingleById<RecipeDTO>(
        'recetas',
        id
      );
      this.recipe = data;
      this.duration = timeFormat(data.preparation_time);
    } catch (error) {
      console.error('Error al cargar la receta:', error);
    }
  }

  async checkIfFavorite() {
    if (!this.recipe || !this.userId) return;

    const { data, error } = await this.supabaseService.client
      .from('favoritos')
      .select('*')
      .eq('user_id', this.userId)
      .eq('recipe_id', this.recipe.id);

    if (error) {
      console.error('Error al comprobar favoritos:', error);
    } else {
      this.favorite = !!data?.length;
    }
  }

  async addToFavorites() {
    if (!this.recipe || !this.userId) {
      console.warn(
        'No se pudo agregar a favoritos: receta o usuario no disponibles.'
      );
      return;
    }
    try {
      const { data, error } = await this.supabaseService.client
        .from('favoritos')
        .insert([{ user_id: this.userId, recipe_id: this.recipe.id }]);

      if (error) {
        console.error('Error al añadir a favoritos:', error.message);
        return;
      }

      console.log('Receta añadida a favoritos:', data);
      this.favorite = true;
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
    }
  }

  async removeFromFavorites() {
    if (!this.recipe || !this.userId) {
      console.warn(
        'No se pudo eliminar de favoritos: receta o usuario no disponibles.'
      );
      return;
    }
    try {
      const { error } = await this.supabaseService.client
        .from('favoritos')
        .delete()
        .eq('user_id', this.userId)
        .eq('recipe_id', this.recipe.id);

      if (error) {
        console.error('Error al eliminar de favoritos:', error.message);
        return;
      }

      console.log('Receta eliminada de favoritos.');
      this.favorite = false;
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
    }
  }


  async addRecipeToAgenda(day: { label: string; dayIndex: number }) {
    if (!this.recipe || !this.userId) {
      console.warn('Información insuficiente para agregar a la agenda.');
      return;
    }

    try {
      const selectedDate = new Date();
      selectedDate.setDate(new Date().getDate() + day.dayIndex);
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const { data: agenda, error } = await this.supabaseService.client
        .from('agenda')
        .select('*')
        .eq('user_id', this.userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error al verificar la agenda existente:', error);
        return;
      }

      const agendaData = agenda?.data || [];
      agendaData.push({
        date: formattedDate,
        recipe_id: this.recipe.id,
        recipe_title: this.recipe.name,
      });

      if (agenda) {
        const { error: updateError } = await this.supabaseService.client
          .from('agenda')
          .update({ data: agendaData })
          .eq('user_id', this.userId);

        if (updateError) {
          console.error('Error al actualizar la agenda:', updateError.message);
          return;
        }
      } else {
        const { error: insertError } = await this.supabaseService.client
          .from('agenda')
          .insert({
            user_id: this.userId,
            data: agendaData,
          });

        if (insertError) {
          console.error('Error al crear una nueva agenda:', insertError.message);
          return;
        }
      }

      this.showToast(`Receta añadida a la agenda para el ${formattedDate}`);
    } catch (error) {
      console.error('Error al agregar la receta a la agenda:', error);
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
