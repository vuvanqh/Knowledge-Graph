using KnowledgeGraph.Infrastructure.DbContexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            var secretKey = config["Jwt:SecretKey"] ?? "default_secret_key_for_testing_purposes_only_1234567890";
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = config["Jwt:Issuer"],
                ValidAudience = config["Jwt:Audience"],
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(secretKey)),
                NameClaimType = ClaimTypes.NameIdentifier,
                //ClockSkew = TimeSpan.Zero
            };
        });

        services.AddAuthorization();
    }
}
