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

  async getMyRecipes(id: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('recetas')
      .select('*')
      // Filters
      .eq('user_id', id);

    if (error) {
      console.error(`Error al cargar mis recetas:`, error.message);
      throw new Error(`No se pudo obtener mis recetas.`);
    }
    return data;
  }

  async readSingleById<T>(tableName: string, id: number): Promise<T> {
    const { data, error } = await this.supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(
        `Error al leer el registro con ID ${id} en la tabla ${tableName}:`,
        error.message
      );
      throw new Error(
        `No se pudo leer el registro con ID ${id} en la tabla ${tableName}.`
      );
    }

    return data as T;
  }

  // Método genérico para leer un solo registro
  async readSingle<T>(
    tableName: string,
    match: Record<string, any>
  ): Promise<T> {
    const { data, error } = await this.supabase
      .from(tableName)
      .select('*')
      .match(match)
      .single();
    if (error) {
      console.error(
        `Error al leer el registro en la tabla ${tableName}:`,
        error.message
      );
      throw new Error(`No se pudo leer el registro en la tabla ${tableName}.`);
    }
    return data as T;
  }

  async updateUsername(
    id: string | undefined,
    username: string | undefined
  ): Promise<void> {
    if (!id || !username) {
      console.error('ID o nombre de usuario no proporcionados');
      throw new Error('ID o nombre de usuario no válidos');
    }

    const { error } = await this.supabase
      .from('usuarios')
      .update({ username })
      .eq('id', id);

    if (error) {
      console.error(`Error al actualizar el nombre de usuario:`, error.message);
      throw new Error(`No se pudo actualizar el nombre de usuario.`);
    }

    console.log(
      `Nombre de usuario actualizado correctamente para el ID: ${id}`
    );
  }

  // Método para eliminar un usuario de la base de datos y de auth.users
  async deleteUser(id: string): Promise<void> {
    // Eliminar usuario de la tabla 'usuarios'
    const { error: deleteError } = await this.supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(
        `Error al eliminar el usuario en la tabla 'usuarios':`,
        deleteError.message
      );
      throw new Error(`No se pudo eliminar el usuario de la tabla 'usuarios'.`);
    }

    // Si la eliminación en 'usuarios' fue exitosa, eliminarlo en 'auth.users'
    const authEndpoint = `https://${environment.supabaseUrl.replace(
      'https://',
      ''
    )}/rest/v1/auth.users?id=eq.${id}`;

    const response = await fetch(authEndpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${environment.supabaseKey}`, // Asegúrate de que este sea tu key con permisos adecuados
        apikey: environment.supabaseKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al eliminar el usuario en 'auth.users':`, errorText);
      throw new Error(`No se pudo eliminar el usuario de 'auth.users'.`);
    }

    console.log(
      `Usuario con ID ${id} eliminado correctamente de ambos lugares.`
    );
  }
}
