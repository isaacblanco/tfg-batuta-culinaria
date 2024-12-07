export interface cartDTO {
  user_id: string;
  shopping_list: {
    recipe_id: number;
    multiplier: number;
    ingredients: { name: string; quantity: number; unit: string }[];
  }[];
}