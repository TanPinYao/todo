using FluentValidation;
using FluentValidation.Results;
using Moq;
using TodoApp.Application.DTOs;
using TodoApp.Application.Services;
using TodoApp.Core.Entities;
using TodoApp.Core.Interfaces;
using Xunit;

namespace TodoApp.Tests.Services
{
    public class TodoService_CreateTests
    {
        [Fact]
        public async Task AddAsync_ShouldCreateTodo_WhenValidationSucceeds()
        {

            var mockRepo = new Mock<ITodoRepository>();
            var mockValidator = new Mock<IValidator<SaveTodoItemDto>>();
            var mockUpdateValidator = new Mock<IValidator<SaveTodoItemDto>>();

            var dto = new SaveTodoItemDto
            {
                title = "Title",
                content = "Content"            
            };

            mockValidator.Setup(v => v.ValidateAsync(dto, default))
                         .ReturnsAsync(new ValidationResult());

            TodoItem capturedEntity = null!;
            mockRepo.Setup(r => r.AddAsync(It.IsAny<TodoItem>()))
                    .Callback<TodoItem>(e =>
                    {
                        e.todo_id = 1;
                        capturedEntity = e;
                    })
                    .Returns(Task.CompletedTask);

            var service = new TodoService(mockRepo.Object, mockValidator.Object, mockUpdateValidator.Object);

            var result = await service.AddAsync(dto);

            Assert.True(result.success);
            Assert.Equal(1, result.data);
            Assert.Equal("Item created successfully.", result.message);
            Assert.Equal("Title", capturedEntity.title);
        }

        [Fact]
        public async Task AddAsync_ShouldReturnError_WhenValidationFails()
        {
            var mockRepo = new Mock<ITodoRepository>();
            var mockValidator = new Mock<IValidator<SaveTodoItemDto>>();
            var mockUpdateValidator = new Mock<IValidator<SaveTodoItemDto>>();

            // missing field
            var dto = new SaveTodoItemDto
            {
                title = "", 
                content = ""
            };

            var validationFailures = new List<ValidationFailure>
            {
                new ValidationFailure("title", "Title is required."),
                new ValidationFailure("content", "Content is required."),
            };

            mockValidator.Setup(v => v.ValidateAsync(dto, default))
                         .ReturnsAsync(new ValidationResult(validationFailures));

            var service = new TodoService(mockRepo.Object, mockValidator.Object, mockUpdateValidator.Object);

            var result = await service.AddAsync(dto);

            Assert.False(result.success);
            Assert.Equal("Validation failed.", result.message);
            Assert.NotNull(result.errors);
            Assert.Equal(2, result.errors!.Count);
            Assert.Contains(result.errors, e => e.PropertyName == "title");
            Assert.Contains(result.errors, e => e.PropertyName == "content");
            mockRepo.Verify(r => r.AddAsync(It.IsAny<TodoItem>()), Times.Never);
        }
    }
}
