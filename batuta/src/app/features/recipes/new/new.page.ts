import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UNITS } from 'src/app/shared/enums/units';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class NewPage implements OnInit {
  units = UNITS;

  constructor() {}

  ngOnInit() {}
}
