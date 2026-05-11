using Moq;
using Xunit;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using KnowledgeGraph.Core.Application;
using KnowledgeGraph.Core.Domain;
using KnowledgeGraph.Core;
using KnowledgeGraph.Core.Applicatio;
using StudentPlanner.Core.Application;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace KnowledgeGraph.Tests.Services;

public class AuthenticationServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<RoleManager<ApplicationRole>> _roleManagerMock;
    private readonly Mock<SignInManager<ApplicationUser>> _signInManagerMock;
    private readonly Mock<IJwtService> _jwtServiceMock;
    private readonly Mock<IRefreshTokenService> _refreshTokenServiceMock;
    private readonly AuthenticationService _authService;

    public AuthenticationServiceTests()
    {
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        var roleStoreMock = new Mock<IRoleStore<ApplicationRole>>();
        _roleManagerMock = new Mock<RoleManager<ApplicationRole>>(roleStoreMock.Object, null!, null!, null!, null!);

        var contextAccessorMock = new Mock<IHttpContextAccessor>();
        var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
        _signInManagerMock = new Mock<SignInManager<ApplicationUser>>(
            _userManagerMock.Object,
            contextAccessorMock.Object,
            claimsFactoryMock.Object,
            null!, null!, null!, null!
        );

        _jwtServiceMock = new Mock<IJwtService>();
        _refreshTokenServiceMock = new Mock<IRefreshTokenService>();

        _authService = new AuthenticationService(
            _userManagerMock.Object,
            _roleManagerMock.Object,
            _signInManagerMock.Object,
            _jwtServiceMock.Object,
            _refreshTokenServiceMock.Object
        );
    }

    [Fact]
    public async Task LoginAsync_EmptyUsername_ThrowsArgumentException()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _authService.LoginAsync("", "password"));
    }

    [Fact]
    public async Task LoginAsync_InvalidCredentials_ThrowsUnauthorizedAccessException()
    {
        _signInManagerMock.Setup(x => x.PasswordSignInAsync("user", "wrong", false, false))
            .ReturnsAsync(SignInResult.Failed);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _authService.LoginAsync("user", "wrong"));
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsRefreshTokenResult()
    {
        var user = new ApplicationUser { UserName = "user" };
        var refreshTokenResult = new RefreshTokenResult { RefreshToken = "token" };

        _signInManagerMock.Setup(x => x.PasswordSignInAsync("user", "password", false, false))
            .ReturnsAsync(SignInResult.Success);
            
        _userManagerMock.Setup(x => x.FindByNameAsync("user"))
            .ReturnsAsync(user);

        _refreshTokenServiceMock.Setup(x => x.IssueOnLogin(user))
            .ReturnsAsync(refreshTokenResult);

        var result = await _authService.LoginAsync("user", "password");

        Assert.Equal("token", result.RefreshToken);
    }

    [Fact]
    public async Task RegisterAsync_EmptyUsername_ThrowsArgumentException()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _authService.RegisterAsync("", "password", "User"));
    }

    [Fact]
    public async Task RegisterAsync_UserExists_ThrowsArgumentException()
    {
        var existingUser = new ApplicationUser { UserName = "user" };
        _userManagerMock.Setup(x => x.FindByNameAsync("user"))
            .ReturnsAsync(existingUser);

        await Assert.ThrowsAsync<ArgumentException>(() => _authService.RegisterAsync("user", "password", "User"));
    }

    [Fact]
    public async Task RegisterAsync_CreationFails_ThrowsException()
    {
        _userManagerMock.Setup(x => x.FindByNameAsync("user"))
            .ReturnsAsync((ApplicationUser)null!);

        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), "password"))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Error" }));

        var ex = await Assert.ThrowsAsync<Exception>(() => _authService.RegisterAsync("user", "password", "User"));
        Assert.Contains("Error", ex.Message);
    }

    [Fact]
    public async Task RegisterAsync_Success_AddsRole()
    {
        _userManagerMock.Setup(x => x.FindByNameAsync("user"))
            .ReturnsAsync((ApplicationUser)null!);

        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), "password"))
            .ReturnsAsync(IdentityResult.Success);

        _roleManagerMock.Setup(x => x.RoleExistsAsync("User"))
            .ReturnsAsync(false);
            
        _roleManagerMock.Setup(x => x.CreateAsync(It.IsAny<ApplicationRole>()))
            .ReturnsAsync(IdentityResult.Success);

        _userManagerMock.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), "User"))
            .ReturnsAsync(IdentityResult.Success);

        await _authService.RegisterAsync("user", "password", "User");

        _userManagerMock.Verify(x => x.CreateAsync(It.IsAny<ApplicationUser>(), "password"), Times.Once);
        _userManagerMock.Verify(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), "User"), Times.Once);
    }

    [Fact]
    public async Task RotateRefreshToken_ValidToken_ReturnsRefreshTokenResponse()
    {
        var user = new ApplicationUser { UserName = "user" };
        var refreshTokenResult = new RefreshTokenResult { RefreshToken = "new_refresh", ExpirationDate = DateTime.UtcNow.AddDays(1) };
        
        _refreshTokenServiceMock.Setup(x => x.RotateTokenAsync("old_refresh"))
            .ReturnsAsync((user, refreshTokenResult));

        _jwtServiceMock.Setup(x => x.CreateToken(user))
            .Returns("new_access");

        var response = await _authService.RotateRefreshToken("old_refresh");

        Assert.Equal("new_access", response.AccessToken);
        Assert.Equal("new_refresh", response.RefreshToken);
    }
}
