using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TodoApp.Application.DTOs;
using TodoApp.Application.Wrappers;
using TodoApp.Core.Entities;
using TodoApp.Core.Interfaces;

namespace TodoApp.Application.Services
{
    public class TodoService
    {
        private readonly ITodoRepository _repository;
        private readonly IValidator<SaveTodoItemDto> _createValidator;
        private readonly IValidator<SaveTodoItemDto> _updateValidator;
        public TodoService(
            ITodoRepository repository,
            IValidator<SaveTodoItemDto> createValidator,
            IValidator<SaveTodoItemDto> updateValidator)
        {
            _repository = repository;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }
        private static TodoItemDto ToDto(TodoItem item)
        {
            return new TodoItemDto
            {
                todo_id = item.todo_id,
                title = item.title,
                content = item.content
            };
        }
        private static TodoItem ToEntity(SaveTodoItemDto dto)
        {
            return new TodoItem
            {
                title = dto.title,
                content = dto.content,
            };
        }
        public async Task<ApiResponse<List<TodoItemDto>>> GetListAsync()
        {
            var items = await _repository
                    .Query()
                    .Where(x => x.deleted_date == null) 
                    .ToListAsync(); 
            var dtoList = items.Select(ToDto).ToList(); 
            return ApiResponse<List<TodoItemDto>>.Success(dtoList);
        }
        public async Task<ApiResponse<TodoItemDto>> GetByIdAsync(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null || item.deleted_date != null)
                return ApiResponse<TodoItemDto>.Fail("Item not found.");

            return ApiResponse<TodoItemDto>.Success(ToDto(item));
        }

        public async Task<ApiResponse<int>> AddAsync(SaveTodoItemDto dto)
        {
            var validation = await _createValidator.ValidateAsync(dto);
            if (!validation.IsValid)
                return ApiResponse<int>.Fail("Validation failed.", validation.Errors);

            var entity = ToEntity(dto);
            await _repository.AddAsync(entity);
            return ApiResponse<int>.Success(entity.todo_id, "Item created successfully.");
        }

        public async Task<ApiResponse<bool>> UpdateAsync(SaveTodoItemDto dto)
        {
            var validation = await _updateValidator.ValidateAsync(dto);
            if (!validation.IsValid)
                return ApiResponse<bool>.Fail("Validation failed.", validation.Errors);

            if (dto.todo_id == null || dto.todo_id == 0)
                return ApiResponse<bool>.Fail("Todo Id Missing.");

            var item = await _repository.GetByIdAsync(dto.todo_id.Value);
            if (item == null || item.deleted_date != null)
                return ApiResponse<bool>.Fail("Item not found or already deleted.");


            item.title = string.IsNullOrWhiteSpace(dto.title) ? item.title : dto.title;
            item.content = string.IsNullOrWhiteSpace(dto.content) ? item.content : dto.content;

            item.updated_date = DateTime.Now;

            await _repository.UpdateAsync(item);
            return ApiResponse<bool>.Success(true, "Item updated successfully.");
        }
        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null || item.deleted_date != null)
                return ApiResponse<bool>.Fail("Item not found or already deleted.");

            item.deleted_date = DateTime.Now;
            item.updated_date = DateTime.Now;

            await _repository.UpdateAsync(item);
            return ApiResponse<bool>.Success(true, "Item deleted successfully.");
        }

    }
}
