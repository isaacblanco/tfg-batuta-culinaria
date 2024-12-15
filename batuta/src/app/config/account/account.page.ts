import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonMenuButton, IonNote, IonRow, IonTitle, IonToggle, IonToolbar } from '@ionic/angular/standalone';
import { LocalStorageService } from './../../core/services/local-storage.service';
import { SupabaseService } from './../../core/services/supabase.service';
import { UserDataDTO } from './../../shared/models/userData-DTO';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonHeader, IonToolbar, IonButtons, IonButton, IonMenuButton, IonIcon, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonImg, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonNote, IonList, IonItemDivider, IonInput, IonItem, IonLabel, IonListHeader, IonToggle, IonFooter],
})
export class AccountPage implements OnInit {
  user: UserDataDTO = {
    id: '',
    username: '',
    preferences: null,
  };
  deleteToggle: boolean = false; // Para confirmar la eliminación del usuario

  constructor(
    private localStorageService: LocalStorageService,
    private alertController: AlertController,
    private supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    const userData = this.localStorageService.getUserData();
    if (!userData) {
      alert('No se ha encontrado el usuario.');
      this.router.navigate(['/login']);
      return;
    }
    this.user = userData;
  }

  async updateUsername(): Promise<void> {
    if (!this.user) {
      console.error('No hay datos de usuario disponibles.');
      return;
    }

    try {
      await this.supabase.updateUsername(this.user.id, this.user.username);

      // Actualizar localStorage con el nuevo nombre de usuario
      const updatedUser = { ...this.user };
      this.localStorageService.setUserData(updatedUser);

      alert('Nombre de usuario actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el nombre de usuario:', error);
      alert('No se pudo actualizar el nombre de usuario. Inténtelo más tarde.');
    }
  }

  async deleteUser(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar su cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (this.user?.id) {
              this.supabase.deleteUser(this.user.id);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
