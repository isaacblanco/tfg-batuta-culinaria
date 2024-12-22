import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recipeFilter',
  standalone: true,
})
export class RecipeFilterPipe implements PipeTransform {
  /**
   * Filtra una lista de recetas según un término de búsqueda
   * @param recipes - Lista de recetas
   * @param searchTerm - Término de búsqueda
   * @returns Lista de recetas filtradas
   */
  transform(recipes: any[], searchTerm: string): any[] {
    if (!recipes || !searchTerm) {
      return recipes; // Devuelve todas las recetas si no hay término de búsqueda
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    return recipes.filter((recipes) =>
      recipes.name.toLowerCase().includes(lowerCaseTerm)
    );
  }
}
