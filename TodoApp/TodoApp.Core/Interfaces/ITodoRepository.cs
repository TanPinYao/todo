using TodoApp.Core.Entities;

namespace TodoApp.Core.Interfaces;
public interface ITodoRepository
{
    IQueryable<TodoItem> Query();
    Task<List<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(int id);
    Task AddAsync(TodoItem item);
    Task UpdateAsync(TodoItem item);
    Task DeleteAsync(int id);
}
