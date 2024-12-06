import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RecipeDTO } from 'src/app/shared/models/recipe-DTO';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
})
export class RecipeCardComponent implements OnInit {
  @Input() recipe!: RecipeDTO;

  constructor() {}

  ngOnInit() {}
}
