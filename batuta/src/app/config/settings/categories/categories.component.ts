import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: any[] = [];
  newCategory: string = '';
  searchQuery: string = '';

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadCategories();
  }

  // Cargar categorías desde Supabase
  async loadCategories() {
    try {
      const data = await this.supabaseService.selectFromTable(
        'categorias',
        '*'
      );
      this.categories = data.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );
      this.filteredCategories = [...this.categories];
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  // Filtrar categorías según la búsqueda
  filterCategories() {
    const query = this.searchQuery.toLowerCase();
    this.filteredCategories = this.categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }

  // Añadir una nueva categoría
  async addCategory() {
    const trimmedCategory = this.newCategory.trim();
    if (!trimmedCategory) {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
    }

    const exists = this.categories.some(
      (category) =>
        category.name.toLowerCase() === trimmedCategory.toLowerCase()
    );

    if (exists) {
      alert('Esta categoría ya existe.');
      return;
    }

    try {
      const newCategory = { name: trimmedCategory };
      await this.supabaseService.insertIntoTable('categorias', newCategory);
      this.categories.push(newCategory);
      this.categories.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.filteredCategories = [...this.categories];
      this.newCategory = '';
    } catch (error) {
      console.error('Error al añadir categoría:', error);
    }
  }

  // Eliminar una categoría
  async deleteCategory(categoryName: string) {
    try {
      await this.supabaseService.client
        .from('categorias')
        .delete()
        .eq('name', categoryName);

      this.categories = this.categories.filter(
        (category) => category.name !== categoryName
      );
      this.filteredCategories = [...this.categories];
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  }
}
