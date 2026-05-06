using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using qlsinhvien.Data;
using qlsinhvien.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace QuanLyySinhVien.Pages
{
    public class ResetPasswordModel : PageModel
    {
        private readonly AppDbContext _context;
        public ResetPasswordModel(AppDbContext context)
        {
            _context = context;
        }

        [BindProperty(SupportsGet = true)]
        public string Token { get; set; } = string.Empty;

        [BindProperty]
        public string NewPassword { get; set; } = string.Empty;

        [BindProperty]
        public string ConfirmPassword { get; set; } = string.Empty;

        public bool ValidToken { get; set; } = false;
        public string Message { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;

        private PasswordReset? _resetRequest = null;

        public async Task OnGetAsync()
        {
            if (string.IsNullOrEmpty(Token)) return;
            _resetRequest = await _context.PasswordResets.FirstOrDefaultAsync(p => p.Token == Token && !p.Used && p.ExpiresAt > DateTime.UtcNow);
            ValidToken = _resetRequest != null;
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (string.IsNullOrEmpty(Token))
            {
                ErrorMessage = "Token không hợp lệ.";
                return Page();
            }

            _resetRequest = await _context.PasswordResets.FirstOrDefaultAsync(p => p.Token == Token && !p.Used && p.ExpiresAt > DateTime.UtcNow);
            if (_resetRequest == null)
            {
                ErrorMessage = "Token không hợp lệ hoặc đã hết hạn.";
                return Page();
            }

            if (string.IsNullOrWhiteSpace(NewPassword) || NewPassword.Length < 8)
            {
                ErrorMessage = "Mật khẩu phải ít nhất 8 ký tự.";
                ValidToken = true;
                return Page();
            }
            if (NewPassword != ConfirmPassword)
            {
                ErrorMessage = "Mật khẩu xác nhận không khớp.";
                ValidToken = true;
                return Page();
            }

            var user = await _context.TaiKhoans.FindAsync(_resetRequest.MaTaiKhoan);
            if (user == null)
            {
                ErrorMessage = "Không tìm thấy tài khoản.";
                return Page();
            }

            // Hash the new password before saving
            var hasher = new PasswordHasher<TaiKhoan>();
            user.MatKhau = hasher.HashPassword(user, NewPassword);
            _resetRequest.Used = true;
            await _context.SaveChangesAsync();

            Message = "Đặt lại mật khẩu thành công. Bạn có thể quay lại đăng nhập.";
            return Page();
        }
    }
}
