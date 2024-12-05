import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit() {}

  async login() {
    try {
      // Iniciar sesión con el email y password
      const user = await this.supabaseService.signIn(this.email, this.password);
      console.log('Usuario logueado:', user);

      // Sincronizar el usuario con la tabla personalizada "Usuarios"
      const userData = await this.syncUserWithDatabase(user);

      // Guardar los datos del usuario en el localStorage
      this.localStorageService.setUserData(userData);

      // Redirigir al usuario a la página principal
      this.router.navigate(['/recipes']);
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error.message);
      this.errorMessage =
        error.message || 'Error desconocido al iniciar sesión';
    }
  }

  // Método para sincronizar usuario autenticado con la tabla "Usuarios"
  async syncUserWithDatabase(authUser: any) {
    try {
      // Verificar si el usuario ya existe en la tabla "Usuarios"
      const { data: existingUser, error } = await this.supabaseService
        .selectFromTable('Usuarios', '*')
        .then((data) => data.find((user) => user.id === authUser.id));

      if (!existingUser) {
        // Crear el registro si el usuario no existe
        const newUser = {
          id: authUser.id, // ID de auth.users
          username: authUser.email.split('@')[0], // Usar el correo para generar un nombre de usuario básico
          preferences: null, // Configuraciones iniciales por defecto
        };

        const createdUser = await this.supabaseService.insertIntoTable(
          'Usuarios',
          newUser
        );

        console.log('Usuario creado en la tabla Usuarios:', createdUser);
        return createdUser;
      } else {
        console.log('Usuario ya existe en la tabla Usuarios:', existingUser);
        return existingUser;
      }
    } catch (err: any) {
      console.error(
        'Error sincronizando usuario con la base de datos:',
        err.message
      );
      throw new Error('Error al sincronizar el usuario con la base de datos.');
    }
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
