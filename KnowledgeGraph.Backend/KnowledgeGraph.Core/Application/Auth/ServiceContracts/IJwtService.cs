using KnowledgeGraph.Core;

namespace StudentPlanner.Core.Application;

public interface IJwtService
{
    string CreateToken(ApplicationUser user);
    double GetMaxSessionLifetimeDays();
    RefreshTokenResult GenerateRefreshToken();
}

