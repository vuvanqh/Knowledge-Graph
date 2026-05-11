using System.ComponentModel.DataAnnotations;

namespace KnowledgeGraph.Core.Application;

public record LoginRequest
{
    [Required]
    public string UserName { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}
