using KnowledgeGraph.Core.Applicatio;
using Microsoft.AspNetCore.Identity;
using StudentPlanner.Core.Application;
using System.Data;

namespace KnowledgeGraph.Core.Application;

public class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly IJwtService _jwtService;
    public AuthenticationService(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtService jwtService, 
        IRefreshTokenService refreshTokenService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _refreshTokenService = refreshTokenService;
    }

    public async Task<RefreshTokenResult> LoginAsync(string username, string password)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentException("Username cannot be empty.");

        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentException("Password cannot be empty.");

        var res = await _signInManager.PasswordSignInAsync(username, password, false, false);
        if(!res.Succeeded)  
            throw new UnauthorizedAccessException("Invalid credentials.");

        ApplicationUser? user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User doesn't exist");
        }

        RefreshTokenResult refreshTokenResult = await _refreshTokenService.IssueOnLogin(user);
        return refreshTokenResult;
        
    }

    public async Task RegisterAsync(string username, string password, string role)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentException("Username cannot be empty.");

        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentException("Password cannot be empty.");

        var user = await _userManager.FindByNameAsync(username);
        if (user != null)
            throw new ArgumentException($"{username} already exists.");

        ApplicationUser appUser = new ()
        {
            UserName = username,
        };

        var res = await _userManager.CreateAsync(appUser, password);

        if (!res.Succeeded)
        {
            var errors = string.Join(", ", res.Errors.Select(e => e.Description));
            throw new Exception($"Failed to register user: {errors}.");
        }

        if (!await _roleManager.RoleExistsAsync(role))
        {
            await _roleManager.CreateAsync(new ApplicationRole { Name = role });
        }
        await _userManager.AddToRoleAsync(appUser, role); 
    }

    public async Task<RefreshTokenResponse> RotateRefreshToken(string refreshToken)
    {
        (ApplicationUser user, RefreshTokenResult refreshTokenResult) = await _refreshTokenService.RotateTokenAsync(refreshToken);

        return new RefreshTokenResponse()
        {
            AccessToken = _jwtService.CreateToken(user),
            RefreshToken = refreshTokenResult.RefreshToken,
            ExpirationDate = refreshTokenResult.ExpirationDate
        };
    }
}
