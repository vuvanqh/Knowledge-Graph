using Microsoft.Extensions.Configuration;
using StudentPlanner.Core.Application;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

namespace KnowledgeGraph.Core.Application;
public class JwtService : IJwtService
{
    private readonly IConfiguration _config;
    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string CreateToken(ApplicationUser user)
    {
        DateTime expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:Expiration_Minutes"]));
        Claim[] claims = [
            new (JwtRegisteredClaimNames.Sub, user.Id.ToString()), //token subject identifier
            new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), //token identifier
            new (JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),ClaimValueTypes.Integer64), //issued at
            new (ClaimTypes.NameIdentifier, user.Id.ToString()),
        ];

        SymmetricSecurityKey securityKey = new (Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)); //secret key
        SigningCredentials signingCredentials = new (securityKey, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken tokenGenerator = new (
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: expires,
            signingCredentials: signingCredentials
        );

        JwtSecurityTokenHandler tokenHandler = new ();

        return tokenHandler.WriteToken(tokenGenerator);
    }
    public double GetMaxSessionLifetimeDays() => Convert.ToInt32(_config["RefreshToken:max_session_lifetime_days"]);
    public RefreshTokenResult GenerateRefreshToken()
    {
        byte[] bytes = new byte[64];
        using var randomNumberGenerator = RandomNumberGenerator.Create();
        randomNumberGenerator.GetBytes(bytes);

        DateTime expiration = DateTime.UtcNow.AddMinutes(Convert.ToInt32(_config["RefreshToken:expiration_minutes"]));
        return new RefreshTokenResult()
        {
            RefreshToken = Convert.ToBase64String(bytes),
            ExpirationDate = expiration
        };
    }
}

