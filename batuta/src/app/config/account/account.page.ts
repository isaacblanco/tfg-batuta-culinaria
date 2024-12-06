import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { LocalStorageService } from './../../core/services/local-storage.service';
import { SupabaseService } from './../../core/services/supabase.service';
import { UserDataDTO } from './../../shared/models/userData-DTO';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
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

  updateUsername() {
    if (!this.user) {
      console.error('User data is not available.');
      return;
    }
    this.supabase.updateUsername(this.user?.id, this.user?.username);
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
