using Moq;
using Xunit;
using Microsoft.Extensions.Configuration;
using KnowledgeGraph.Core.Application;
using KnowledgeGraph.Core;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Collections.Generic;

namespace KnowledgeGraph.Tests.Services;

public class JwtServiceTests
{
    private readonly JwtService _jwtService;
    private readonly IConfiguration _config;

    public JwtServiceTests()
    {
        var inMemorySettings = new Dictionary<string, string> {
            {"Jwt:Expiration_Minutes", "60"},
            {"Jwt:Key", "this_is_a_very_long_secret_key_for_testing_purposes"},
            {"Jwt:Issuer", "TestIssuer"},
            {"Jwt:Audience", "TestAudience"},
            {"RefreshToken:max_session_lifetime_days", "7"},
            {"RefreshToken:expiration_minutes", "1440"}
        };

        _config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        _jwtService = new JwtService(_config);
    }

    [Fact]
    public void CreateToken_ValidUser_ReturnsToken()
    {
        var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "testuser" };

        var token = _jwtService.CreateToken(user);

        Assert.False(string.IsNullOrEmpty(token));
        
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        Assert.Equal("TestIssuer", jwtToken.Issuer);
        Assert.Contains("TestAudience", jwtToken.Audiences);
    }

    [Fact]
    public void GetMaxSessionLifetimeDays_ReturnsExpectedValue()
    {
        var days = _jwtService.GetMaxSessionLifetimeDays();
        Assert.Equal(7, days);
    }

    [Fact]
    public void GenerateRefreshToken_ReturnsValidToken()
    {
        var result = _jwtService.GenerateRefreshToken();
        
        Assert.NotNull(result);
        Assert.False(string.IsNullOrEmpty(result.RefreshToken));
        Assert.True(result.ExpirationDate > DateTime.UtcNow);
    }
}
