using FluentValidation;
using TodoApp.Application.DTOs;

namespace TodoApp.Application.Validators;

public class SaveTodoItemValidator : AbstractValidator<SaveTodoItemDto>
{
    public SaveTodoItemValidator()
    {
        RuleFor(x => x.title)
            .NotEmpty()
            .WithMessage("Title is required.");

        RuleFor(x => x.content)
            .NotEmpty()
            .WithMessage("Content is required.");
    }
}