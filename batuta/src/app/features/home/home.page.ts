import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LocalStorageService } from './../../core/services/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink],
})
export class HomePage implements OnInit {
  username: string = 'Usuario';

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.username = this.localStorageService.getUsername();
  }
}
