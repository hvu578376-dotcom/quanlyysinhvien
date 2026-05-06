using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace QuanLyySinhVien.Pages
{
    public class LoginModel : PageModel
    {
        private readonly AppDbContext _context;

        public LoginModel(AppDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public string Username { get; set; } = string.Empty;

        [BindProperty]
        public string Password { get; set; } = string.Empty;

        public string ErrorMessage { get; set; } = string.Empty;

        public void OnGet()
        {
            // Nếu đã đăng nhập, chuyển hướng về trang chủ
            if (User?.Identity?.IsAuthenticated == true)
            {
                Response.Redirect("/");
            }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
            {
                ModelState.AddModelError(string.Empty, "Vui lòng nhập tài khoản và mật khẩu.");
                return Page();
            }

            // Lấy tài khoản từ DB theo tên đăng nhập hoặc email và kiểm tra mật khẩu đã hash
            var user = await _context.TaiKhoans.FirstOrDefaultAsync(t => (t.TenDangNhap == Username || t.Email == Username) && t.TrangThai == true);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Tài khoản hoặc mật khẩu không đúng.");
                return Page();
            }

            var hasher = new PasswordHasher<TaiKhoan>();
            PasswordVerificationResult verify;
            try
            {
                verify = hasher.VerifyHashedPassword(user, user.MatKhau, Password);
            }
            catch (FormatException)
            {
                // existing DB may contain plaintext passwords (legacy). Fallback: compare directly
                if (!string.IsNullOrEmpty(user.MatKhau) && user.MatKhau == Password)
                {
                    // migrate to hashed password
                    user.MatKhau = hasher.HashPassword(user, Password);
                    await _context.SaveChangesAsync();
                    verify = PasswordVerificationResult.Success;
                }
                else
                {
                    verify = PasswordVerificationResult.Failed;
                }
            }

            if (verify == PasswordVerificationResult.SuccessRehashNeeded)
            {
                // rehash to latest format
                user.MatKhau = hasher.HashPassword(user, Password);
                await _context.SaveChangesAsync();
                verify = PasswordVerificationResult.Success;
            }

            if (verify != PasswordVerificationResult.Success)
            {
                ModelState.AddModelError(string.Empty, "Tài khoản hoặc mật khẩu không đúng.");
                return Page();
            }

            // Tạo claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.HoTen ?? user.TenDangNhap),
                new Claim(ClaimTypes.NameIdentifier, user.MaTaiKhoan.ToString()),
                new Claim(ClaimTypes.Role, user.VaiTro ?? "User"),
                new Claim("TenDangNhap", user.TenDangNhap)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8)
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authProperties);

            // Redirect based on role
            var role = (user.VaiTro ?? string.Empty).ToLowerInvariant();
            if (role.Contains("admin") || role.Contains("quantri") || role.Contains("quản trị"))
            {
                return Redirect("/admin");
            }
            if (role.Contains("giangvien") || role.Contains("giảng viên"))
            {
                return Redirect("/teacher");
            }
            // default student or other roles -> SPA root
            return Redirect("/");
        }
    }
}
