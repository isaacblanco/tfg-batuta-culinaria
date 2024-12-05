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

  /**
   * Comprueba si la contraseña es fuerte
   * @param password - La contraseña a comprobar: La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números
   * @returns true si la contraseña es fuerte, false en caso contrario
   */
  isPasswordStrong(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  }

  async signUp() {
    if (!this.isPasswordStrong(this.password)) {
      this.errorMessage =
        'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.';
      return;
    }

    try {
      const user = await this.supabaseService.signUp(this.email, this.password);
      console.log('Usuario registrado:', user);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error de registro:', error.message);
      this.errorMessage = error.message || 'Error desconocido al registrarse';
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
