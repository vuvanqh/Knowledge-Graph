using System.ComponentModel.DataAnnotations;

namespace KnowledgeGraph.Core.Application;
public class RegisterRequest
{
    [Required(ErrorMessage = "UserName is required.")] 
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password cannot be empty.")] 
    public string Password { get; set; } = string.Empty;

    [Required, Compare("Password", ErrorMessage = "Passwords do not match.")]
    public string ConfirmPassword { get; set; } = string.Empty;
}
