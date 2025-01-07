import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol,
  IonContent, IonGrid, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonRow, IonText
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonText, IonButton, IonInput, IonItem, IonIcon, IonLabel, IonContent, IonGrid, IonRow, IonCol, IonImg, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('LoginPage');
    const user = this.localStorageService.getUserData();
    if (!user) {
      this.localStorageService.clearUserData();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    try {
      const user = await this.supabaseService.signIn(this.email, this.password);
      console.log('Usuario logueado:', user);
  
      const userData = await this.syncUserWithDatabase(user);
      this.localStorageService.setUserData(userData);
  
      this.authService.login();
      // Confirmar datos críticos antes de redirigir
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error.message);
      this.errorMessage = error.message || 'Error desconocido al iniciar sesión';
    }
  }
  
  

  // Método para sincronizar usuario autenticado con la tabla "usuarios"
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

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
