using System.ComponentModel.DataAnnotations;

namespace TodoApp.Core.Entities;

public class TodoItem
{
    [Key]
    public int todo_id { get; set; }

    public string title { get; set; } = string.Empty;

    public string content { get; set; } = string.Empty;

    public DateTime created_date { get; set; } = DateTime.Now;

    public DateTime? updated_date { get; set; }

    public DateTime? deleted_date { get; set; }
}