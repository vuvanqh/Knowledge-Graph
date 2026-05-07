using KnowledgeGraph.Infrastructure.DbContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Routing.Matching;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeGraph.Backend;

public static class BaselineConfigExtention
{
    public static void ConfigureBaseline(this IServiceCollection services, IConfiguration config)
    {
        services.AddRouting(opt =>
        {
            opt.LowercaseUrls = true;
        });

        services.AddCors(opt =>
        {
            opt.AddPolicy("Allow Frontend", policy =>
            {
                var origin = config.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
                policy.AllowCredentials();
                policy.WithOrigins();
            });
        });

        services.AddControllers(options =>
        {
            var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
            options.Filters.Add(new AuthorizeFilter(policy));
            options.Filters.Add(new ProducesAttribute("application/json"));
            options.Filters.Add(new ConsumesAttribute("application/json"));
        });

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(config.GetConnectionString("Default"), sqlOptions =>
            {
                sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorNumbersToAdd: null);
            });
            //options.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
            //options.EnableSensitiveDataLogging();
        });

        services.AddAuthorization();
    }
}
