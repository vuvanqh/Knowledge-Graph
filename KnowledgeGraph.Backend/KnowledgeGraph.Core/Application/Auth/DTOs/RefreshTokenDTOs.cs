using System.ComponentModel.DataAnnotations;

namespace KnowledgeGraph.Core;


public record RefreshTokenResponse
{
    [Required] public string AccessToken { get; set; } = null!;
    [Required] public string RefreshToken { get; set; } = null!;
    [Required] public DateTime ExpirationDate { get; set; }
}

public record RefreshTokenResult
{
    [Required] public string RefreshToken { get; set; } = null!;
    [Required] public DateTime ExpirationDate { get; set; }
}


