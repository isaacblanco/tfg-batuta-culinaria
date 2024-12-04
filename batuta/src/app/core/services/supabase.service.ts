import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  // Método para registro
  async signUp(email: string, password: string) {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return user;
  }

  // Método para inicio de sesión
  async signIn(email: string, password: string) {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return user;
  }

  // Método para cerrar sesión
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Método para obtener el usuario autenticado
  getUser() {
    return this.supabase.auth.getUser();
  }

  // Ejemplo: Obtener recetas
  async getRecipes() {
    const { data, error } = await this.supabase.from('recipes').select('*');
    if (error) throw error;
    return data;
  }
}
