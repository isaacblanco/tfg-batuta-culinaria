import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ia',
  templateUrl: './ia.page.html',
  styleUrls: ['./ia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class IaPage implements OnInit {
  ingredients: string = ''; // Contiene los ingredientes ingresados por el usuario
  recipes: string[] = []; // Almacena los resultados sugeridos
  loading: boolean = false; // Indica si la IA está generando resultados

  constructor(private toastController: ToastController) {}

  ngOnInit() {}

  async generateRecipes() {
    if (!this.ingredients.trim()) {
      this.showToast('Por favor, ingresa algunos ingredientes.');
      return;
    }

    this.loading = true;
    this.recipes = []; // Limpiar resultados anteriores

    try {
      const response = await fetch('http://127.0.0.1:1337/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-ins-7b-q4',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente que sugiere recetas basadas en ingredientes.',
            },
            {
              role: 'user',
              content: `Genera recetas con los siguientes ingredientes: ${this.ingredients}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Error al comunicarse con la IA.');
      }

      const data = await response.json();
      this.recipes = data.choices[0].message.content
        .split('\n') // Suponemos que las recetas están separadas por líneas
        .filter((line: string) => line.trim() !== ''); // Filtrar líneas vacías
    } catch (error) {
      console.error('Error al generar recetas:', error);
      this.showToast('Error al generar recetas. Inténtalo de nuevo.');
    } finally {
      this.loading = false;
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
