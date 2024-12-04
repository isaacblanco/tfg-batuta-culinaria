import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-ia',
  templateUrl: './ia.page.html',
  styleUrls: ['./ia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class IaPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
