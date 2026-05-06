using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LopHocApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LopHocApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.LopHocs
                .Select(x => new
                {
                    maLop = x.MaLop,
                    tenLop = x.TenLop,
                    khoa = x.Khoa,
                    nienKhoa = x.NienKhoa,
                    maNganh = x.MaNganh,
                    // số sinh viên của lớp (dựa trên navigation TaiKhoans)
                    soLuongSinhVien = x.TaiKhoans.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LopHoc model)
        {
            _context.LopHocs.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LopHoc model)
        {
            var entity = await _context.LopHocs.FindAsync(id);
            if (entity == null) return NotFound();

            entity.TenLop = model.TenLop;
            entity.Khoa = model.Khoa;
            entity.NienKhoa = model.NienKhoa;
            entity.MaNganh = model.MaNganh;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.LopHocs.FindAsync(id);
            if (entity == null) return NotFound();

            _context.LopHocs.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoa lop hoc thanh cong" });
        }
    }
}