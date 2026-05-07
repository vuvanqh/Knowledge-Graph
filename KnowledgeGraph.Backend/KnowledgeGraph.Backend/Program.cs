namespace KnowledgeGraph.Backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.ConfigureBaseline(builder.Configuration);

        var app = builder.Build();

        //// Configure the HTTP request pipeline.

        //app.UseHttpsRedirection();

        app.UseRouting();

        app.UseCors("AllowFrontend");
        app.UseAuthentication();
        app.UseAuthorization();

        app.Run();
    }
}
