using KnowledgeGraph.Core;
using KnowledgeGraph.Core.Domain;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Text;

namespace StudentPlanner.Core.Application;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly IJwtService _tokenService;
    private readonly IUserRepository _userRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    public RefreshTokenService(
        IJwtService tokenService,
        UserManager<ApplicationUser> userManager,
        IUserRepository userRepository
        )
    {
        _tokenService = tokenService;
        _userManager = userManager;
        _userRepository = userRepository;
    }
    public string HashToken(string token)
    {
        using var hash = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(token);
        return Convert.ToBase64String(hash.ComputeHash(bytes));
    }

    public async Task<(ApplicationUser, RefreshTokenResult)> RotateTokenAsync(string currentToken)
    {
        ApplicationUser? user = await _userRepository.GetUserByRefreshTokenAsync(HashToken(currentToken));

        if (user == null)
            throw new InvalidOperationException("Invalid Token");

        if (user.RefreshTokenExpirationDate < DateTime.UtcNow)
            throw new InvalidOperationException("Refresh token expired");

        if (user.RefreshTokenIssuedAt.AddDays(_tokenService.GetMaxSessionLifetimeDays()) < DateTime.UtcNow)
            throw new InvalidOperationException("Session Expired");

        return (user, await IssueAndPersistChanges(user));
    }
    public async Task<RefreshTokenResult> IssueOnLogin(ApplicationUser user)
    {
        user.RefreshTokenIssuedAt = DateTime.UtcNow;

        return await IssueAndPersistChanges(user);
    }


    private async Task<RefreshTokenResult> IssueAndPersistChanges(ApplicationUser user)
    {
        RefreshTokenResult result = _tokenService.GenerateRefreshToken();
        var tokenHash = HashToken(result.RefreshToken);
        var expiratinoDate = result.ExpirationDate;
        user.RefreshTokenExpirationDate = expiratinoDate;
        user.RefreshToken = tokenHash;
        user.RefreshTokenIssuedAt = DateTime.UtcNow;

        await _userManager.UpdateAsync(user);

        return result;
    }
}
