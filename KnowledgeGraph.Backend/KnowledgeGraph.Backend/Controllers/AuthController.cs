using KnowledgeGraph.Core;
using KnowledgeGraph.Core.Applicatio;
using KnowledgeGraph.Core.Application;
using KnowledgeGraph.Core.Domain;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeGraph.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    public AuthController(IAuthenticationService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        try
        {
            await _authService.RegisterAsync(request.Username, request.Password, UserRole.User.ToString());
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        { 
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        try
        {
            RefreshTokenResult refreshTokenResult = await _authService.LoginAsync(request.UserName,request.Password);
            Response.Cookies.Append("refreshToken", refreshTokenResult.RefreshToken, new CookieOptions()
            {
                HttpOnly = true, //prevents js/ts from reading the cookie & protects against xss attacks
                Secure = true, //only sent over https
                SameSite = SameSiteMode.Lax, //blocks csrf attacks
                Expires = refreshTokenResult.ExpirationDate,
                Path = "/api/auth"
            });
            return Ok();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        string? token = Request.Cookies["refreshToken"];
        if (token != null)
        {
            try
            {
                RefreshTokenResponse resp = await _authService.RotateRefreshToken(token);

                Response.Cookies.Append("refreshToken", resp.RefreshToken, new CookieOptions()
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = resp.ExpirationDate,
                    Path = "/api/auth"
                });

                return Ok(resp.AccessToken);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        return Unauthorized("Session Expired");
    }
}
