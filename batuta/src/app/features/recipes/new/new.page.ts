import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonButton, IonButtons,
  IonCol,
  IonContent, IonGrid, IonHeader, IonIcon,
  IonInput,
  IonItem, IonItemDivider, IonLabel, IonList, IonMenuButton, IonRow,
  IonSegment, IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar
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
    IonButton,
    IonButtons,
    IonContent,
    IonCol,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonMenuButton,
    IonRow,
    IonSelect,
    IonSegment,
    IonSegmentButton,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar,
    
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
    }
  
    // Comprobar si estamos en modo creación o edición
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      const recipeIdNumber = parseInt(this.recipeId, 10);
  
      if (recipeIdNumber === 0) {
        // Caso: creación de nueva receta
        this.isEditMode = false;
        console.log("Modo creación de receta");
      } else {
        // Caso: edición de receta existente
        this.isEditMode = true;
        this.recipe.id = recipeIdNumber;
        console.log("Modo edición, Receta ID:", this.recipeId);
        this.loadRecipe(this.recipeId);
      }
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
      console.log("Receta cargada:", recipe);
    } catch (error: any) {
      console.error('Error al cargar la receta:', error.message || error);
      alert('No se pudo cargar la receta. Por favor, inténtalo de nuevo.');
    }
  }
  

  // Guardar receta (crear o actualizar)
  async saveRecipe() {
    if (!this.isFormValid()) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
  
    const payload = { ...this.recipe, user_id: this.userId };
  
    try {
      if (this.isEditMode) {
        // Actualizar receta existente
        await this.supabaseService.updateTable('recetas', payload, this.recipeId!);
        alert('Receta actualizada con éxito.');
      } else {
        // Crear nueva receta
        const { id, ...recipeToSave } = payload; // Excluir el campo `id` al crear el objeto

        await this.supabaseService.insertIntoTable('recetas', recipeToSave);
        alert('Receta creada con éxito.');
      }
    } catch (error: any) {
      console.error('Error al guardar la receta:', error.message || error);
      alert('Ocurrió un error al guardar la receta. Inténtalo de nuevo.');
    }
  }
  

  updateDurationUnit(index: number, event: any) {
    const isChecked = event.detail.checked;
    this.recipe.steps[index].durationUnit = isChecked ? 'seconds' : 'minutes';
    
    // Forzar la detección de cambios
    this.recipe.steps = [...this.recipe.steps];
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

  handleDurationUnitChange(index: number, event: any) {
    const newUnit = event.detail.value;
    const step = this.recipe.steps[index];
    
    // Convertir el valor cuando se cambia la unidad
    if (newUnit === 'seconds' && step.durationUnit === 'minutes') {
      step.duration = Math.round(step.duration * 60);
    } else if (newUnit === 'minutes' && step.durationUnit === 'seconds') {
      step.duration = Math.round(step.duration / 60);
    }
    
    step.durationUnit = newUnit;
    
    // Asegurar que el valor está dentro de los límites
    this.validateDuration(index, { detail: { value: step.duration } });
  }

  validateDuration(index: number, event: any) {
    const value = event.detail.value;
    const step = this.recipe.steps[index];
    
    if (step.durationUnit === 'minutes') {
      if (value > 180) step.duration = 180; // máximo 3 horas
      if (value < 1) step.duration = 1;
    } else {
      if (value > 3600) step.duration = 3600; // máximo 1 hora en segundos
      if (value < 1) step.duration = 1;
    }
  }

  // Validar si el formulario está completo
  isFormValid(): boolean {
    return (
      !!this.recipe.name &&
      !!this.recipe.preparation_time &&
      !!this.recipe.num_people &&
      !!this.recipe.category_id &&
      this.recipe.ingredients.every(
        (ing) => !!ing.name && !!ing.quantity && !!ing.unit
      ) &&
      this.recipe.steps.every((step) => !!step.duration && !!step.instructions)
    );
  }
  
  
}
