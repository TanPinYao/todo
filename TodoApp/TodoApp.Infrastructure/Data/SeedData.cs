using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using TodoApp.Core.Entities;
using TodoApp.Infrastructure.Data;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var context = new AppDbContext(
            serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>());

        if (context.TodoItems.Any()) return;

        var now = DateTime.Now;

        var todos = new[]
        {
            new TodoItem { title = "Seed - Buy groceries", content = "Milk, eggs, bread, and vegetables." },
            new TodoItem {  title = "Seed - Clean the house", content = "Vacuum, mop floors, and organize the kitchen."},
            new TodoItem { title = "Seed - Finish coding assignment", content = "Implement backend CRUD endpoints and add Swagger." },
            new TodoItem {  title = "Seed - Read a book", content = "Read at least 30 pages of a self-development book." },
            new TodoItem { title = "Seed - Exercise", content = "Go for a 30-minute run or do a workout routine." }       
        };

        context.TodoItems.AddRange(todos);
        context.SaveChanges();
    }
}