import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonMenuButton, IonNote, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LocalStorageService } from './../core/services/local-storage.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonNote,
    IonImg,
    RouterLink,
    IonButtons,
    IonMenuButton
],
  providers: [LocalStorageService]
})
export class HomePage {

  username: string = 'Usuario';
  constructor(  
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.username = this.localStorageService.getUsername();
  }
}
