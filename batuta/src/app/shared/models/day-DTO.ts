import { RecipeDTO } from './recipe-DTO';

export interface DayDTO {
  id: string;
  date: string;
  recipes: RecipeDTO[];
}
