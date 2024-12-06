export interface RecipeDTO {
  id_recipe: number;
  name: string;
  description: string;
  ingredients: { name: string; quantity: number; unit: string }[]; // Ingredientes con detalles
  steps: { duration: number; instructions: string }[]; // Pasos con duración e instrucciones
  preparation_time: string; // Tiempo de preparación en formato HH:MM:SS
  difficulty: number; // Nivel de dificultad (1 = Baja, 2 = Media, 3 = Alta)
  num_people: number; // Número de porciones
  category_id: number; // ID de categoría
  image_url: string; // URL de la imagen
}
