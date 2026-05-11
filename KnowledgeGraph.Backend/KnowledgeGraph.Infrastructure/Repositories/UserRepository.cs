using KnowledgeGraph.Core;
using KnowledgeGraph.Core.Domain;
using KnowledgeGraph.Infrastructure.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeGraph.Infrastructure.Repositories;

public class UserRepository: IUserRepository
{
    private readonly ApplicationDbContext _context;
    public UserRepository(ApplicationDbContext context)
    {
        _context = context; 
    }

    public async Task<ApplicationUser?> GetUserByRefreshTokenAsync(string token)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == token);
    }
}
