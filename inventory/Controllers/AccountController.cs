using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using inventory.Models;
using inventory.Services;
using Microsoft.AspNetCore.Authorization;

namespace inventory.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAuthService _authService;

        public AccountController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromForm] UserLogin model)
        {
            if (!ModelState.IsValid) return View(model);

            var token = await _authService.GenerateJwtTokenAsync(model.Username, model.Password);
            if (token == null)
            {
                ModelState.AddModelError(string.Empty, "Usuario o contraseña inválidos");
                return View(model);
            }

            var user = await _authService.GetUserByUsernameAsync(model.Username);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user!.Username),
                new Claim("UserId", user.UserId.ToString())
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(int.Parse(HttpContext.RequestServices.GetRequiredService<IConfiguration>().GetValue<string>("Jwt:ExpireMinutes")!))
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

            // set token cookie (HttpOnly recommended)
            Response.Cookies.Append("AuthToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddMinutes(int.Parse(HttpContext.RequestServices.GetRequiredService<IConfiguration>().GetValue<string>("Jwt:ExpireMinutes")!))
            });

            // Redirect to the application view with a specific route
            return RedirectToAction("Content");
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            Response.Cookies.Delete("AuthToken");
            return RedirectToAction("Login");
        }

        // Application shell route — accessible at '/content'
        [Authorize]
        [HttpGet("/content")]
        public IActionResult Content()
        {
            return View("~/Views/Content/Content.cshtml");
        }
    }
}
