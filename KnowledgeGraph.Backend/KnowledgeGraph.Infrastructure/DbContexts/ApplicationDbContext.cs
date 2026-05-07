using KnowledgeGraph.Core;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeGraph.Infrastructure.DbContexts;

public class ApplicationDbContext: IdentityDbContext< ApplicationUser, ApplicationRole, Guid>
{
    public ApplicationDbContext(DbContextOptions opt): base(opt) { }
}
