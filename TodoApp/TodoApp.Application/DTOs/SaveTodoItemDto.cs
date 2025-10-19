namespace TodoApp.Application.DTOs;

public class SaveTodoItemDto
{
    public int? todo_id { get; set; } // nullable, so POST can skip it
    public string title { get; set; } = string.Empty;
    public string content { get; set; } = string.Empty;
}