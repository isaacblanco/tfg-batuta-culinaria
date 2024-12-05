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
  async signUp(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error('Sign-up error:', error.message);
      throw new Error('No se pudo registrar el usuario: ' + error.message);
    }
    return data.user;
  }

  // Método para inicio de sesión
  async signIn(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Login error:', error.message);
      throw new Error('Error al iniciar sesión: ' + error.message);
    }
    return data.user;
  }

  // Método para cerrar sesión
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Sign-out error:', error.message);
      throw new Error('Error al cerrar sesión: ' + error.message);
    }
  }

  // Método para obtener el usuario autenticado
  async getUser(): Promise<any> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error.message);
      throw new Error('No se pudo obtener el usuario: ' + error.message);
    }
    return data.user;
  }

  // Método genérico para seleccionar datos de una tabla
  async selectFromTable(tableName: string, query: any = '*'): Promise<any[]> {
    const { data, error } = await this.supabase.from(tableName).select(query);
    if (error) {
      console.error(
        `Error al seleccionar datos de la tabla ${tableName}:`,
        error.message
      );
      throw new Error(`No se pudo obtener los datos de la tabla ${tableName}.`);
    }
    return data;
  }

  // Método genérico para insertar datos en una tabla
  async insertIntoTable(tableName: string, values: any): Promise<any> {
    const { data, error } = await this.supabase.from(tableName).insert(values);
    if (error) {
      console.error(
        `Error al insertar datos en la tabla ${tableName}:`,
        error.message
      );
      throw new Error(`No se pudo insertar datos en la tabla ${tableName}.`);
    }
    return data;
  }

  // Método para obtener recetas
  async getRecipes(): Promise<any[]> {
    return this.selectFromTable('recetas');
  }
}
