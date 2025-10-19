import axios from "axios";
import { TodoItemDto, SaveTodoItemDto } from "../types";

export interface ValidationFailure {
  propertyName: string;
  errorMessage: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: ValidationFailure[];
}
export interface GetTodosApi {
  url: "/list";
  method: "POST";
  query: undefined;
  requestData: undefined;
  response: ApiResponse<TodoItemDto[]>;
}
export interface CreateTodoApi {
  url: "/";
  method: "POST";
  requestData: Omit<SaveTodoItemDto, "todo_id">;
  response: ApiResponse<null>;
}

export interface UpdateTodoApi {
  url: "/";
  method: "PUT";
  requestData: SaveTodoItemDto;
  response: ApiResponse<null>;
}

export interface DeleteTodoApi {
  url: "/:id";
  method: "DELETE";
  query: { id: number };
  response: ApiResponse<null>;
}


const API_BASE = "https://localhost:7139/Todo";

const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

export const getTodos = async () => {
  const response = await api.post<GetTodosApi["response"]>("/list");
  const { success, data, message } = response.data ;

  if (!success) throw new Error(message || "Failed to load todos");
  return data;
};

export const createTodo = (dto: CreateTodoApi["requestData"]) =>
  api.post<CreateTodoApi["response"]>("/", dto);

export const updateTodo = (dto: UpdateTodoApi["requestData"]) =>
  api.put<UpdateTodoApi["response"]>("/", dto);

export const deleteTodo = (id: number) =>
  api.delete<DeleteTodoApi["response"]>(`/${id}`);
