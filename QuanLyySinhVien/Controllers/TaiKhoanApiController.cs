using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.TaiKhoans
                .Select(t => new
                {
                    maTaiKhoan = t.MaTaiKhoan,
                    tenDangNhap = t.TenDangNhap,
                    // Do not expose hashed password
                    matKhau = "********",
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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaiKhoan model)
        {
            // Hash password before saving
            var hasher = new PasswordHasher<TaiKhoan>();
            if (!string.IsNullOrEmpty(model.MatKhau))
            {
                model.MatKhau = hasher.HashPassword(model, model.MatKhau);
            }
            _context.TaiKhoans.Add(model);
            await _context.SaveChangesAsync();
            // do not return password value
            model.MatKhau = "";
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaiKhoan model)
        {
            var entity = await _context.TaiKhoans.FindAsync(id);
            if (entity == null) return NotFound();
            entity.TenDangNhap = model.TenDangNhap;
            // If password provided, hash it. If empty or null, keep existing password.
            if (!string.IsNullOrWhiteSpace(model.MatKhau))
            {
                var hasher = new PasswordHasher<TaiKhoan>();
                entity.MatKhau = hasher.HashPassword(entity, model.MatKhau);
            }
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
