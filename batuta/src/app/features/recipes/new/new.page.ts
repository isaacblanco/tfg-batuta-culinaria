import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonButton, IonButtons,
  IonCol,
  IonContent, IonGrid, IonHeader, IonIcon,
  IonItem, IonItemDivider, IonLabel, IonList, IonMenuButton, IonRow, IonSegmentButton,
  IonSelectOption, IonTitle, IonToggle, IonToolbar
} from '@ionic/angular/standalone';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { UNITS } from 'src/app/shared/enums/units';
import { RecipeDTO } from 'src/app/shared/models/recipe-DTO';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NewPage),
      multi: true,
    }
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonSegmentButton,
    IonButton,
    IonSelectOption,
    IonItemDivider,
    IonToggle,
    IonList,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class NewPage implements OnInit {

  units = UNITS;
  recipeId: string | null = null; // ID de la receta (opcional)
  userId: string = ''; // ID del usuario autenticado
  categories: Array<{ id: number; name: string }> = []; // Categorías disponibles

  recipe: RecipeDTO = {
    name: '',
    intro: '',
    preparation_time: '00:30:00',
    ingredients: [{ name: '', quantity: 1, unit: 'grs' }],
    steps: [{ duration: 1, instructions: '', durationUnit: 'minutes' }],
    labels: '',
    difficulty: 1,
    category_id: 1,
    num_people: 1,
    image_url: 'assets/no-image.svg',
    id: 0,
    user_id: '',
  };

  isEditMode = false; // Indica si estamos en modo edición

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    // Obtener datos del usuario autenticado
    const userData = this.localStorageService.getUserData();
    if (userData) {
      this.userId = userData.id;
      this.recipe.user_id = this.userId;
      console.log("usuario: ", this.userId);
    }

    // Comprobar si estamos en modo edición o creación
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.isEditMode = true;
      this.recipe.id = parseInt( this.recipeId );
      console.log("Receta id", this.recipeId);
      this.loadRecipe(this.recipeId); // Cargar receta existente

    }

    this.loadCategories();
  }

  // Cargar las categorías disponibles
  async loadCategories() {
    try {
      const data = await this.supabaseService.selectFromTable(
        'categorias',
        '*'
      );
      this.categories = data.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  // Cargar receta existente para edición
  async loadRecipe(id: string) {
    try {
      const recipe = await this.supabaseService.readSingle<RecipeDTO>(
        'recetas',
        { id }
      );

      if (recipe.user_id !== this.userId) {
        alert('No tienes permiso para editar esta receta.');
        return;
      }

      this.recipe = { ...recipe };
    } catch (error: any) {
      console.error('Error al cargar la receta:', error.message || error);
    }
  }

  // Guardar receta (crear o actualizar)
  async saveRecipe() {
    const payload = { ...this.recipe, user_id: this.userId };

    try {
      if (this.isEditMode) {
        // Actualizar receta existente
        await this.supabaseService.updateTable('recetas', payload, this.recipeId!);
        alert('Receta actualizada con éxito.');
      } else {
        // Crear nueva receta
        await this.supabaseService.insertIntoTable('recetas', payload);
        alert('Receta creada con éxito.');
      }
    } catch (error: any) {
      console.error('Error al guardar la receta:', error.message || error);
      alert('Ocurrió un error al guardar la receta. Inténtalo de nuevo.');
    }
  }

  updateDurationUnit(index: number, isChecked: boolean) {
    this.recipe.steps[index].durationUnit = isChecked ? 'seconds' : 'minutes';
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
  

  // Añadir un nuevo ingrediente
  addIngredient() {
    this.recipe.ingredients.push({ name: '', quantity: 1, unit: 'grs' });
  }

  // Eliminar un ingrediente existente
  removeIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }

  // Añadir un nuevo paso
  addStep() {
    this.recipe.steps.push({
      duration: 1,
      instructions: '',
      durationUnit: 'minutes',
    });
  }

  // Eliminar un paso existente
  removeStep(index: number) {
    this.recipe.steps.splice(index, 1);
  }

  // Validar si el formulario está completo
  isFormValid(): boolean {
    return (
      !!this.recipe.name &&
      !!this.recipe.preparation_time 
    );
    
  }
  
}
