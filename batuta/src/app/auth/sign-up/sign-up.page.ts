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

      // Creamos un usuario en la base de datos
      this.syncUserWithDatabase(user);

      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error de registro:', error.message);
      this.errorMessage = error.message || 'Error desconocido al registrarse';
    }
  }

  async syncUserWithDatabase(authUser: any) {
    try {
      // Verificar si el usuario ya existe en la tabla "usuarios"
      const existingUser = await this.supabaseService
        .selectFromTable('usuarios', 'id, username, preferences')
        .then((data) => data.find((user) => user.id === authUser.id));

      if (!existingUser) {
        // Crear el registro si el usuario no existe
        const newUser = {
          id: authUser.id, // ID de auth.users
          username: authUser.email.split('@')[0], // Nombre de usuario basado en el email
          preferences: null, // Configuraciones iniciales por defecto
        };

        const createdUser = await this.supabaseService.insertIntoTable(
          'usuarios',
          newUser
        );

        // console.log('Usuario creado en la tabla usuarios:', createdUser);
        return createdUser[0]; // Supabase devuelve un array con los datos insertados
      } else {
        // console.log('Usuario ya existe en la tabla usuarios:', existingUser);
        return existingUser;
      }
    } catch (err: any) {
      console.error(
        'Error sincronizando usuario con la base de datos:',
        err.message
      );
      throw new Error(
        'Error al sincronizar el usuario con la base de datos. Intentado de nuevo'
      );
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
