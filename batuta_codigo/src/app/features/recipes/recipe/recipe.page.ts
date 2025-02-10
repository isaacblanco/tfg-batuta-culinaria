import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonList, IonMenuButton, IonNote, IonPopover, IonRow, IonTitle, IonToolbar, MenuController, NavController, ToastController } from '@ionic/angular/standalone';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { RecipeDTO } from 'src/app/shared/models/recipe-DTO';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { timeFormat } from 'src/app/shared/utils/dateTime-utils';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink,IonItemDivider,IonGrid, IonRow, IonCol, IonPopover,IonImg, IonList, IonNote,IonButton,IonButtons,IonContent,IonHeader,IonIcon,IonItem,IonLabel,IonMenuButton,IonTitle,IonToolbar],
})
export class RecipePage implements OnInit {
  @ViewChild('menuPopover') popover!: IonPopover;

  recipe: RecipeDTO | null = null;
  duration: string = '';
  favorite: boolean = false;
  userId: string = '';
  isAuthor: boolean = false; // Indica si el usuario es el autor
  author: string = ''; // Nombre del autor
  weekDays: { label: string; dayIndex: number }[] = []; // Botones con los días de la semana

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private shoppingCartService: ShoppingCartService,
    private navCtrl: NavController,
    private router: Router,
    private toastController: ToastController,
    private menuController: MenuController // Añadido para controlar el menú
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
    console.log('Cargando receta con ID:', id);
    try {
      // Paso 1: Cargar la receta
      const recipeData = await this.supabaseService.readSingleById<RecipeDTO>(
        'recetas',
        id
      );
  
      this.recipe = { ...recipeData };
      this.duration = timeFormat(this.recipe.preparation_time);
  
      // Paso 2: Verificar si el usuario actual es el autor
      this.isAuthor = this.recipe?.user_id === this.userId;
  
      // Paso 3: Obtener el nombre del autor desde la tabla usuarios
      if (this.recipe.user_id) {
        const authorData = await this.supabaseService.readSingle<any>('usuarios', {
          id: this.recipe.user_id,
        });
  
        this.author = authorData?.username || 'Autor desconocido';
        
      } else {
        this.author = 'Autor desconocido';
        console.warn('No se encontró user_id en la receta.');
      }
    } catch (error) {
      console.error('Error al cargar la receta o el autor:', error);
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
        // console.error('Error al añadir a favoritos:', error.message);
        return;
      }

      // console.log('Receta añadida a favoritos:', data);
      this.favorite = true;
    } catch (error) {
      // console.error('Error al añadir a favoritos:', error);
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

      // console.log('Receta eliminada de favoritos.');
      this.favorite = false;
    } catch (error) {
      // console.error('Error al eliminar de favoritos:', error);
    }
  }

  async addRecipeToAgenda(day: { label: string; dayIndex: number }) {
    if (!this.recipe || !this.userId) {
      console.warn('Información insuficiente para agregar a la agenda.');
      return;
    }
  
    try {
      // Determinar la fecha seleccionada
      const selectedDate = new Date();
      selectedDate.setDate(new Date().getDate() + day.dayIndex);
      const formattedDate = selectedDate.toISOString().split('T')[0];
  
      // Verificar si la agenda ya existe
      const { data: agenda, error } = await this.supabaseService.client
        .from('agenda')
        .select('*')
        .eq('user_id', this.userId)
        .single();
  
      if (error && error.code !== 'PGRST116') {
        console.error('Error al verificar la agenda existente:', error);
        return;
      }
  
      // Preparar los datos de la receta para agregar a la agenda
      const recipeData = {
        date: formattedDate,
        recipe_name: this.recipe.name,
        recipe_id: this.recipe.id,
        recipe_title: this.recipe.name,
        ingredients: this.recipe.ingredients || [], // Incluye los ingredientes
      };
  
      // Si la agenda ya existe, actualízala
      const agendaData = agenda?.data || [];
      agendaData.push(recipeData);
  
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
        // Si no existe una agenda, crea una nueva
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

  async addToShoppingList() {
    if (!this.recipe || !this.userId) {
      console.warn('Receta o usuario no disponible.');
      return;
    }

    try {
      await this.shoppingCartService.addRecipeToCart(this.userId, this.recipe);
      this.showToast('Receta añadida a la lista de la compra.');
      await this.popover.dismiss();
    } catch (error) {
      console.error('Error al añadir a la lista de la compra:', error);
    }
  }

  duplicateRecipe() {
    // NO disponible
    console.log('Duplicar receta:', this.recipe);
    // Implementa la lógica para duplicar la receta
  }

  async editRecipe() {
    console.log('Editar receta:', this.recipe);
    if (this.recipe) {
      await this.menuController.close(); // Cierra el menú antes de navegar
      await this.popover.dismiss();
      this.router.navigate(['/new', this.recipe.id]);
    }
  }
}
