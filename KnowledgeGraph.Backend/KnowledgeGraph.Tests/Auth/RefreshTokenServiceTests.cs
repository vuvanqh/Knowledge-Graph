using Moq;
using Xunit;
using Microsoft.AspNetCore.Identity;
using KnowledgeGraph.Core.Application;
using KnowledgeGraph.Core.Domain;
using KnowledgeGraph.Core;
using StudentPlanner.Core.Application;
using System;
using System.Threading.Tasks;

namespace KnowledgeGraph.Tests.Services;

public class RefreshTokenServiceTests
{
    private readonly Mock<IJwtService> _jwtServiceMock;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly RefreshTokenService _refreshTokenService;

    public RefreshTokenServiceTests()
    {
        _jwtServiceMock = new Mock<IJwtService>();
        _userRepositoryMock = new Mock<IUserRepository>();

        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        _refreshTokenService = new RefreshTokenService(
            _jwtServiceMock.Object,
            _userManagerMock.Object,
            _userRepositoryMock.Object
        );
    }

    [Fact]
    public async Task RotateTokenAsync_InvalidToken_ThrowsInvalidOperationException()
    {
        _userRepositoryMock.Setup(x => x.GetUserByRefreshTokenAsync(It.IsAny<string>()))
            .ReturnsAsync((ApplicationUser)null!);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _refreshTokenService.RotateTokenAsync("invalid"));
    }

    [Fact]
    public async Task RotateTokenAsync_ExpiredRefreshToken_ThrowsInvalidOperationException()
    {
        var user = new ApplicationUser 
        { 
            RefreshTokenExpirationDate = DateTime.UtcNow.AddDays(-1),
            RefreshTokenIssuedAt = DateTime.UtcNow.AddDays(-1)
        };

        _userRepositoryMock.Setup(x => x.GetUserByRefreshTokenAsync(It.IsAny<string>()))
            .ReturnsAsync(user);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _refreshTokenService.RotateTokenAsync("token"));
        Assert.Equal("Refresh token expired", ex.Message);
    }

    [Fact]
    public async Task RotateTokenAsync_SessionExpired_ThrowsInvalidOperationException()
    {
        var user = new ApplicationUser 
        { 
            RefreshTokenExpirationDate = DateTime.UtcNow.AddDays(1),
            RefreshTokenIssuedAt = DateTime.UtcNow.AddDays(-10)
        };

        _jwtServiceMock.Setup(x => x.GetMaxSessionLifetimeDays()).Returns(7);

        _userRepositoryMock.Setup(x => x.GetUserByRefreshTokenAsync(It.IsAny<string>()))
            .ReturnsAsync(user);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _refreshTokenService.RotateTokenAsync("token"));
        Assert.Equal("Session Expired", ex.Message);
    }

    [Fact]
    public async Task RotateTokenAsync_ValidToken_ReturnsNewToken()
    {
        var user = new ApplicationUser 
        { 
            RefreshTokenExpirationDate = DateTime.UtcNow.AddDays(1),
            RefreshTokenIssuedAt = DateTime.UtcNow.AddDays(-1)
        };

        var newTokenResult = new RefreshTokenResult 
        { 
            RefreshToken = "new_refresh", 
            ExpirationDate = DateTime.UtcNow.AddDays(1) 
        };

        _jwtServiceMock.Setup(x => x.GetMaxSessionLifetimeDays()).Returns(7);
        _jwtServiceMock.Setup(x => x.GenerateRefreshToken()).Returns(newTokenResult);

        _userRepositoryMock.Setup(x => x.GetUserByRefreshTokenAsync(It.IsAny<string>()))
            .ReturnsAsync(user);

        var (returnedUser, result) = await _refreshTokenService.RotateTokenAsync("valid_token");

        Assert.Equal(user, returnedUser);
        Assert.Equal("new_refresh", result.RefreshToken);
        Assert.NotNull(user.RefreshToken);
    }

    [Fact]
    public async Task IssueOnLogin_ValidUser_ReturnsRefreshTokenResult()
    {
        var user = new ApplicationUser();
        var tokenResult = new RefreshTokenResult 
        { 
            RefreshToken = "new_refresh", 
            ExpirationDate = DateTime.UtcNow.AddDays(1) 
        };

        _jwtServiceMock.Setup(x => x.GenerateRefreshToken()).Returns(tokenResult);

        var result = await _refreshTokenService.IssueOnLogin(user);

        Assert.Equal("new_refresh", result.RefreshToken);
        Assert.NotNull(user.RefreshToken);
        Assert.Equal(tokenResult.ExpirationDate, user.RefreshTokenExpirationDate);
    }
}
