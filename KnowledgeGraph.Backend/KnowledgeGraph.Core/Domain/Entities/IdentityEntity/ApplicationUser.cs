using Microsoft.AspNetCore.Identity;

namespace KnowledgeGraph.Core;

public class ApplicationUser : IdentityUser<Guid>
{
    public DateTime RefreshTokenExpirationDate { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenIssuedAt { get; set; }
}
