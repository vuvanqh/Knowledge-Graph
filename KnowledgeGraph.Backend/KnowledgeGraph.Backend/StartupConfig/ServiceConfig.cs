using KnowledgeGraph.Core.Applicatio;
using KnowledgeGraph.Core.Application;
using KnowledgeGraph.Core.Domain;
using KnowledgeGraph.Infrastructure.Repositories;
using StudentPlanner.Core.Application;

namespace KnowledgeGraph.Backend;

public static class ServiceConfig
{
    public static void ConfigureServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddTransient<IJwtService, JwtService>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();

        services.AddScoped<IUserRepository, UserRepository>();
    }
}