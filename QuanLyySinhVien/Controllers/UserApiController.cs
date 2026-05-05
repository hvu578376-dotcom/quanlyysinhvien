using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;

namespace QuanLyySinhVien.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserApiController : ControllerBase
    {
        [HttpGet("current")]
        [Authorize]
        public IActionResult Current()
        {
            var name = User?.Identity?.Name ?? string.Empty;
            var id = User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var role = User?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            return Ok(new { name, id, role });
        }

        [HttpPost("logout")]
        public async System.Threading.Tasks.Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { success = true });
        }
    }
}
