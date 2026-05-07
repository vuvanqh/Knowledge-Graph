using System;
using System.Collections.Generic;
using System.Text;

namespace KnowledgeGraph.Core.Applicatio;

public interface IAuthenticationService
{
    Task<string> LoginAsync(string username, string password);
    Task RegisterAsync(string username, string password, string role);
}
