import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SignUpPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {}

  async signUp() {
    try {
      await this.supabaseService.signUp(this.email, this.password);
      this.router.navigate(['/login']); // Redirige al usuario a la página de login
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
