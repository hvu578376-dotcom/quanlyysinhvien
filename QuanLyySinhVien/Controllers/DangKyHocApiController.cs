using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DangKyHocApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DangKyHocApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.DangKyHocs
                .Include(x => x.SinhVien)
                .Include(x => x.LopHocPhan)
                .Select(x => new
                {
                    maDangKy = x.MaDangKy,
                    maSinhVien = x.MaSinhVien,
                    tenSinhVien = x.SinhVien != null ? x.SinhVien.HoTen : null,
                    maLopHocPhan = x.MaLopHocPhan,
                    tenLopHocPhan = x.LopHocPhan != null ? x.LopHocPhan.TenLopHocPhan : null,
                    ngayDangKy = x.NgayDangKy,
                    trangThai = x.TrangThai
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DangKyHoc model)
        {
            _context.DangKyHocs.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DangKyHoc model)
        {
            var entity = await _context.DangKyHocs.FindAsync(id);
            if (entity == null) return NotFound();

            entity.MaSinhVien = model.MaSinhVien;
            entity.MaLopHocPhan = model.MaLopHocPhan;
            entity.NgayDangKy = model.NgayDangKy;
            entity.TrangThai = model.TrangThai;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.DangKyHocs.FindAsync(id);
            if (entity == null) return NotFound();

            _context.DangKyHocs.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoa dang ky hoc thanh cong" });
        }
    }
}