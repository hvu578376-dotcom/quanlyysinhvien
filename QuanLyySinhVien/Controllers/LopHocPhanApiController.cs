using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LopHocPhanApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LopHocPhanApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.LopHocPhans
                .Include(x => x.MonHoc)
                .Include(x => x.GiangVien)
                .Include(x => x.HocKy)
                .Select(x => new
                {
                    maLopHocPhan = x.MaLopHocPhan,
                    tenLopHocPhan = x.TenLopHocPhan,
                    maMonHoc = x.MaMonHoc,
                    tenMonHoc = x.MonHoc != null ? x.MonHoc.TenMonHoc : null,
                    maGiangVien = x.MaGiangVien,
                    tenGiangVien = x.GiangVien != null ? x.GiangVien.HoTen : null,
                    maHocKy = x.MaHocKy,
                    tenHocKy = x.HocKy != null ? x.HocKy.TenHocKy : null,
                    namHoc = x.HocKy != null ? x.HocKy.NamHoc : null,
                    soLuongToiDa = x.SoLuongToiDa,
                    thoiGianBatDau = x.ThoiGianBatDau,
                    thoiGianKetThuc = x.ThoiGianKetThuc,
                    trangThai = x.TrangThai
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LopHocPhan model)
        {
            _context.LopHocPhans.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LopHocPhan model)
        {
            var entity = await _context.LopHocPhans.FindAsync(id);
            if (entity == null) return NotFound();

            entity.TenLopHocPhan = model.TenLopHocPhan;
            entity.MaMonHoc = model.MaMonHoc;
            entity.MaGiangVien = model.MaGiangVien;
            entity.MaHocKy = model.MaHocKy;
            entity.SoLuongToiDa = model.SoLuongToiDa;
            entity.ThoiGianBatDau = model.ThoiGianBatDau;
            entity.ThoiGianKetThuc = model.ThoiGianKetThuc;
            entity.TrangThai = model.TrangThai;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.LopHocPhans.FindAsync(id);
            if (entity == null) return NotFound();

            _context.LopHocPhans.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoa lop hoc phan thanh cong" });
        }
    }
}