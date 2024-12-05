import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private userKey = 'user_data';

  // Guardar datos del usuario
  setUserData(data: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(data));
  }

  // Obtener datos del usuario
  getUserData(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  getUserId(): string {
    const userData = this.getUserData();
    return userData ? userData.id : null;
  }

  // Limpiar datos del usuario
  clearUserData(): void {
    localStorage.removeItem(this.userKey);
  }
}
