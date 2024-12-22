export interface RecipeDTO {
  id: number;
  user_id: string;
  name: string;
  steps: { duration: number; instructions: string; durationUnit: string }[]; // Pasos con duración e instrucciones
  preparation_time: string; // Tiempo de preparación en formato HH:MM:SS
  category_id: number; // ID de categoría
  image_url: string; // URL de la imagen
  num_people: number; // Número de porciones
  difficulty: number; // Nivel de dificultad (1 = Baja, 2 = Media, 3 = Alta)
  ingredients: { name: string; quantity: number; unit: string }[]; // Ingredientes con detalles
  labels: string;
  intro: string;
}
