using Serilog;

namespace KnowledgeGraph.Backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.ConfigureBaseline(builder.Configuration);
        builder.Services.ConfigureServices(builder.Configuration);

        builder.Host.UseSerilog((HostBuilderContext context, IServiceProvider services, LoggerConfiguration loggerConfiguration) => {
            loggerConfiguration.ReadFrom.Configuration(context.Configuration) //give serilog permission to read the config from appsettings.json
                               .ReadFrom.Services(services); //read the services & make them available to the serilog
        });

        var app = builder.Build();

        //// Configure the HTTP request pipeline.

        //app.UseHttpsRedirection();

        app.UseRouting();

        app.UseSerilogRequestLogging();

        app.UseCors("AllowFrontend");
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
