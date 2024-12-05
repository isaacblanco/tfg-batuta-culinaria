import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // Verificar si el usuario está almacenado en el localStorage
    const user = this.localStorageService.getUserData();

    if (!user) {
      // Si no hay usuario en localStorage, verificar en Supabase
      const { data: authUser } = await this.supabaseService.getUser();
      if (!authUser) {
        this.router.navigate(['/login']);
        return false;
      }

      // Sincronizar usuario con la tabla personalizada "usuarios"
      const userData = await this.supabaseService
        .selectFromTable('usuarios', '*')
        .then((data) => data.find((u) => u.id === authUser.id));

      if (!userData) {
        this.router.navigate(['/login']);
        return false;
      }

      // Guardar el usuario sincronizado en el localStorage
      this.localStorageService.setUserData(userData);
      return true;
    }

    return true;
  }
}
