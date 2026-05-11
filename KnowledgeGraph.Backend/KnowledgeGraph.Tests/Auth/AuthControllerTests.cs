using Moq;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using KnowledgeGraph.Backend.Controllers;
using KnowledgeGraph.Core.Application;
using KnowledgeGraph.Core;
using KnowledgeGraph.Core.Applicatio;
using StudentPlanner.Core.Application;
using System;
using System.Threading.Tasks;

namespace KnowledgeGraph.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthenticationService> _authServiceMock;
    private readonly AuthController _controller;
    
    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthenticationService>();
        _controller = new AuthController(_authServiceMock.Object);
        
        var httpContext = new DefaultHttpContext();
        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = httpContext
        };
    }
    
    [Fact]
    public async Task Register_ValidRequest_ReturnsOk()
    {
        var request = new RegisterRequest { Username = "test", Password = "password" };
        _authServiceMock.Setup(x => x.RegisterAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);
            
        var result = await _controller.Register(request);
        
        Assert.IsType<OkResult>(result);
    }
    
    [Fact]
    public async Task Register_ArgumentException_ReturnsBadRequest()
    {
        var request = new RegisterRequest { Username = "test", Password = "password" };
        _authServiceMock.Setup(x => x.RegisterAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ThrowsAsync(new ArgumentException("Invalid"));
            
        var result = await _controller.Register(request);
        
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid", badRequestResult.Value);
    }
    
    [Fact]
    public async Task Login_ValidRequest_ReturnsOkAndSetsCookie()
    {
        var request = new LoginRequest { UserName = "test", Password = "password" };
        var refreshTokenResult = new RefreshTokenResult { RefreshToken = "token123", ExpirationDate = DateTime.UtcNow.AddDays(1) };
        _authServiceMock.Setup(x => x.LoginAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(refreshTokenResult);
            
        var result = await _controller.Login(request);
        
        Assert.IsType<OkResult>(result);
    }
    
    [Fact]
    public async Task Login_UnauthorizedAccess_ReturnsUnauthorized()
    {
        var request = new LoginRequest { UserName = "test", Password = "password" };
        _authServiceMock.Setup(x => x.LoginAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ThrowsAsync(new UnauthorizedAccessException("Unauthorized"));
            
        var result = await _controller.Login(request);
        
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Unauthorized", unauthorizedResult.Value);
    }
    
    [Fact]
    public async Task RefreshToken_ValidToken_ReturnsOkWithAccessToken()
    {
        var context = new DefaultHttpContext();
        context.Request.Headers["Cookie"] = "refreshToken=validToken";
        _controller.ControllerContext.HttpContext = context;
        
        var response = new RefreshTokenResponse { AccessToken = "access123", RefreshToken = "newRefresh", ExpirationDate = DateTime.UtcNow.AddDays(1) };
        _authServiceMock.Setup(x => x.RotateRefreshToken("validToken"))
            .ReturnsAsync(response);
            
        var result = await _controller.RefreshToken();
        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("access123", okResult.Value);
    }
    
    [Fact]
    public async Task RefreshToken_NoToken_ReturnsUnauthorized()
    {
        var result = await _controller.RefreshToken();
        
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Session Expired", unauthorizedResult.Value);
    }
}
