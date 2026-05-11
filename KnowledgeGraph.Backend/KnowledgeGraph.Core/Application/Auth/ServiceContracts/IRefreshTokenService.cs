using KnowledgeGraph.Core;

namespace StudentPlanner.Core.Application;

public interface IRefreshTokenService
{
    Task<(ApplicationUser, RefreshTokenResult)> RotateTokenAsync(string currentToken);
    Task<RefreshTokenResult> IssueOnLogin(ApplicationUser user);
    string HashToken(string token);
}
