import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonListHeader, IonMenuButton, IonReorder, IonReorderGroup, IonSpinner, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { RecipeDTO } from 'src/app/shared/models/recipe-DTO';
import { TimeFormatPipe } from 'src/app/shared/pipes/time-format.pipe';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.page.html',
  styleUrls: ['./cook.page.scss'],
  standalone: true,
  imports: [ CommonModule, TimeFormatPipe, IonHeader, IonToolbar, IonTitle,IonSpinner, IonButton, IonButtons, IonMenuButton, IonButton, IonIcon, IonContent, IonItem, IonItemDivider, IonItemOptions, IonItemOption, IonItemSliding, IonLabel, IonList, IonListHeader, IonReorder, IonReorderGroup, IonItemOptions, IonItemOption, IonItemSliding, IonLabel, IonList, IonListHeader, IonReorder, IonReorderGroup, IonItemOptions, IonItemOption, IonItemSliding, IonLabel, IonList, IonListHeader, IonReorder, IonReorderGroup],
})
export class CookPage implements OnInit, OnDestroy {
  recipe: RecipeDTO | null = null;
  currentStepIndex: number = 0;
  remainingTime: number = 0;
  timer: any = null;
  timerRunning: boolean = false;
  userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    const userData = await this.supabaseService.getUser();
    if (userData) {
      this.userId = userData.id;
    }
    if (recipeId) {
      await this.loadRecipe(parseInt(recipeId, 10));
      this.setRemainingTime();
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  async loadRecipe(id: number) {
    try {
      const data = await this.supabaseService.readSingleById<RecipeDTO>(
        'recetas',
        id
      );
      this.recipe = data;
      
    } catch (error) {
      console.error('Error al cargar la receta:', error);
    }
  }

  navigateBack() {
    this.navCtrl.back();
  }

  nextStep() {
    if (this.currentStepIndex < this.recipe!.steps.length - 1) {
      this.currentStepIndex++;
      this.resetTimer();
      this.setRemainingTime();
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.resetTimer();
      this.setRemainingTime();
    }
  }

  closeCooking() {
    this.router.navigate(['/recipe', this.recipe?.id]);
  }

  setRemainingTime() {
    const currentStep = this.recipe?.steps[this.currentStepIndex];
    if (currentStep) {
      // Convertir a segundos si la unidad es minutos
      this.remainingTime = currentStep.durationUnit === 'minutes' 
        ? currentStep.duration * 60 
        : currentStep.duration;
    }
  }

  startTimer() {
    if (this.remainingTime > 0 && !this.timerRunning) {
      this.timerRunning = true;
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          this.clearTimer();
        }
      }, 1000);
    }
  }

  resetTimer() {
    this.clearTimer();
    this.setRemainingTime();
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      // this.timer = null;
      this.setRemainingTime();
    }
    this.timerRunning = false;
  }
}
