using KnowledgeGraph.Core.Applicatio;
using KnowledgeGraph.Core.Application;

namespace KnowledgeGraph.Backend;

public static class ServiceConfig
{
    public static void ConfigureServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddScoped<IAuthenticationService, AuthenticationService>();
    }
}