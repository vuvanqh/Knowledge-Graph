namespace KnowledgeGraph.Core.Domain;

public interface IUserRepository
{
    Task<ApplicationUser?> GetUserByRefreshTokenAsync(string token);
}
