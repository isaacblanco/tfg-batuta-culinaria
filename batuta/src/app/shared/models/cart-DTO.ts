export interface cartDTO {
  user_id: string;
  shopping_list: {
    recipe_id: number;
    recipe_name: string;
    multiplier: number;
    ingredients: { name: string; quantity: number; unit: string }[];
  }[];
}