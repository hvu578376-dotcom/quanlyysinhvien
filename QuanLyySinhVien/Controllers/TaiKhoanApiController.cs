using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaiKhoanApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaiKhoanApiController(AppDbContext context)
        {
            _context = context;
        }

        // DTO: yêu cầu đăng nhập
        public class LoginRequest
        {
            public string TenDangNhap { get; set; } = "";
            public string MatKhau { get; set; } = "";
        }

        // DTO: trả về thông tin user sau đăng nhập (KHÔNG trả mật khẩu)
        public class LoginResponse
        {
            public int MaTaiKhoan { get; set; }
            public string TenDangNhap { get; set; } = "";
            public string VaiTro { get; set; } = "";
            public string TrangThai { get; set; } = "";
            public string? Email { get; set; }
            public string? HoTen { get; set; }
        }

        // ✅ GET ALL (SỬA: không trả matKhau)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.TaiKhoans
                .Select(t => new
                {
                    maTaiKhoan = t.MaTaiKhoan,
                    tenDangNhap = t.TenDangNhap,
                    // matKhau = t.MatKhau, // ❌ bỏ
                    vaiTro = t.VaiTro,
                    trangThai = t.TrangThai,
                    email = t.Email,
                    hoTen = t.HoTen,
                    soDienThoai = t.SoDienThoai,
                    ngaySinh = t.NgaySinh,
                    gioiTinh = t.GioiTinh,
                    diaChi = t.DiaChi,
                    maLop = t.MaLop,
                    chuyenNganh = t.ChuyenNganh,
                    hocVi = t.HocVi
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.TenDangNhap) || string.IsNullOrWhiteSpace(req.MatKhau))
                return BadRequest(new { message = "Thiếu tên đăng nhập hoặc mật khẩu" });

            var user = await _context.TaiKhoans.FirstOrDefaultAsync(t =>
                t.TenDangNhap == req.TenDangNhap && t.MatKhau == req.MatKhau);

            if (user == null)
                return Unauthorized(new { message = "Sai tên đăng nhập hoặc mật khẩu" });

            // ✅ Ép TrangThai về string để không bị lỗi kiểu dữ liệu (int/string đều chạy)
            var statusRaw = Convert.ToString(user.TrangThai) ?? "";
            var status = statusRaw.Trim().ToLower();

            // Nếu bạn dùng 0/1: 0 = khóa, 1 = hoạt động
            // Nếu bạn dùng chữ: "khoa", "inactive"...
            if (!string.IsNullOrEmpty(status) &&
                (status.Contains("khoa") || status == "0" || status.Contains("inactive")))
            {
                return Forbid();
            }

            var res = new LoginResponse
            {
                MaTaiKhoan = user.MaTaiKhoan,
                TenDangNhap = user.TenDangNhap,
                VaiTro = Convert.ToString(user.VaiTro) ?? "",
                TrangThai = statusRaw,
                Email = user.Email,
                HoTen = user.HoTen
            };

            return Ok(res);
        }

        // ✅ CREATE (giữ như bạn đang có)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaiKhoan model)
        {
            _context.TaiKhoans.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        // ✅ UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaiKhoan model)
        {
            var entity = await _context.TaiKhoans.FindAsync(id);
            if (entity == null) return NotFound();

            entity.TenDangNhap = model.TenDangNhap;
            entity.MatKhau = model.MatKhau;
            entity.VaiTro = model.VaiTro;
            entity.TrangThai = model.TrangThai;
            entity.Email = model.Email;
            entity.HoTen = model.HoTen;
            entity.SoDienThoai = model.SoDienThoai;
            entity.NgaySinh = model.NgaySinh;
            entity.GioiTinh = model.GioiTinh;
            entity.DiaChi = model.DiaChi;
            entity.MaLop = model.MaLop;
            entity.ChuyenNganh = model.ChuyenNganh;
            entity.HocVi = model.HocVi;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        // ✅ DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.TaiKhoans.FindAsync(id);
            if (entity == null) return NotFound();

            _context.TaiKhoans.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công" });
        }
    }
}