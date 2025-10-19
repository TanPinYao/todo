namespace TodoApp.Application.DTOs;

public class TodoItemDto
{
    public int todo_id { get; set; }
    public string title { get; set; } = string.Empty;
    public string content { get; set; } = string.Empty;
}