using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using qlsinhvien.Data;
using qlsinhvien.Models;
using Microsoft.EntityFrameworkCore;

namespace QuanLyySinhVien.Pages
{
    public class ForgotPasswordModel : PageModel
    {
        private readonly AppDbContext _context;
        public ForgotPasswordModel(AppDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public string Identifier { get; set; } = string.Empty; // email or username

        public string ResetLink { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (string.IsNullOrWhiteSpace(Identifier))
            {
                ErrorMessage = "Vui lòng nhập email hoặc tên đăng nhập.";
                return Page();
            }

            // find user by email or username
            var user = await _context.TaiKhoans.FirstOrDefaultAsync(t => t.Email == Identifier || t.TenDangNhap == Identifier);
            if (user == null)
            {
                ErrorMessage = "Không tìm thấy tài khoản với thông tin cung cấp.";
                return Page();
            }

            // create token
            var token = Guid.NewGuid().ToString("N");
            var reset = new PasswordReset
            {
                MaTaiKhoan = user.MaTaiKhoan,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(2),
                Used = false
            };
            _context.PasswordResets.Add(reset);
            await _context.SaveChangesAsync();

            // create link - in production send email
            var link = Url.Page("/ResetPassword", null, new { token = token }, Request.Scheme);
            ResetLink = link;
            Message = "Yêu cầu đã được tạo. (Demo: link hiển thị phía dưới). Nếu có cấu hình email, hệ thống sẽ gửi link tới email của bạn.";

            return Page();
        }
    }
}
