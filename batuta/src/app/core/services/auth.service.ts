import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(
    this.checkInitialAuthState()
  );
  isAuthenticated$ = this.authState.asObservable();

  constructor(private localStorageService: LocalStorageService) {}

  // Método para verificar el estado inicial de autenticación
  private checkInitialAuthState(): boolean {
    const userData = this.localStorageService.getUserData();
    return !!userData; // Autenticado si existe userData
  }

  // Método para actualizar el estado de autenticación
  updateAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }

  // Método para iniciar sesión (puedes añadir lógica personalizada aquí si lo necesitas)
  login(): void {
    this.updateAuthState(true);
  }

  // Método para cerrar sesión
  logout(): void {
    this.localStorageService.clearUserData(); // Limpia datos del LocalStorage
    this.updateAuthState(false);
  }
}
