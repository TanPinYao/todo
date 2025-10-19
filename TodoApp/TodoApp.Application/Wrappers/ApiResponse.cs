using FluentValidation.Results;

namespace TodoApp.Application.Wrappers;

public class ApiResponse<T>
{
    public bool success { get; set; }
    public string message { get; set; } = string.Empty;
    public T data { get; set; } = default!;
    public List<ValidationFailure>? errors { get; set; }

    public static ApiResponse<T> Success(T data, string message = "")
    {
        return new ApiResponse<T> { success = true, data = data, message = message };
    }

    public static ApiResponse<T> Fail(string message, List<ValidationFailure>? errors = null)
    {
        return new ApiResponse<T> { success = false, message = message, errors = errors };
    }
}
