using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhanCongGiangDayApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PhanCongGiangDayApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.PhanCongGiangDays
                .Include(x => x.GiangVien)
                .Include(x => x.MonHoc)
                .Include(x => x.LopHoc)
                .Include(x => x.HocKy)
                .Select(x => new
                {
                    maPhanCong = x.MaPhanCong,
                    maGiangVien = x.MaGiangVien,
                    tenGiangVien = x.GiangVien != null ? x.GiangVien.HoTen : null,
                    maMonHoc = x.MaMonHoc,
                    tenMonHoc = x.MonHoc != null ? x.MonHoc.TenMonHoc : null,
                    maLop = x.MaLop,
                    tenLop = x.LopHoc != null ? x.LopHoc.TenLop : null,
                    maHocKy = x.MaHocKy,
                    tenHocKy = x.HocKy != null ? x.HocKy.TenHocKy : null,
                    namHoc = x.HocKy != null ? x.HocKy.NamHoc : null
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PhanCongGiangDay model)
        {
            _context.PhanCongGiangDays.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PhanCongGiangDay model)
        {
            var entity = await _context.PhanCongGiangDays.FindAsync(id);
            if (entity == null) return NotFound();

            entity.MaGiangVien = model.MaGiangVien;
            entity.MaMonHoc = model.MaMonHoc;
            entity.MaLop = model.MaLop;
            entity.MaHocKy = model.MaHocKy;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.PhanCongGiangDays.FindAsync(id);
            if (entity == null) return NotFound();

            _context.PhanCongGiangDays.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoa phan cong giang day thanh cong" });
        }
    }
}