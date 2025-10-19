export interface TodoItemDto {
  todo_id: number;
  title: string;
  content: string;
}

export interface SaveTodoItemDto {
  todo_id?: number; 
  title: string;
  content?: string;
}
