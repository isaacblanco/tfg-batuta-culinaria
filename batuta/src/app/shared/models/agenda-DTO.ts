
export interface agendaDTO {
  user_id: string;
  data: { 
    date: string; 
    recipe_id: number; 
    recipe_title: string;
  }[];
}
