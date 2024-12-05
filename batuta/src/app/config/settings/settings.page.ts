import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CategoriesComponent } from './categories/categories.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class SettingsPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async openCategoriesModal() {
    const modal = await this.modalController.create({
      component: CategoriesComponent,
      cssClass: 'categories-modal',
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('Modal closed with data:', data);
    }
  }
}
