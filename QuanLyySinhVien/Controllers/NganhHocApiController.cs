using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NganhHocApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NganhHocApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.NganhHocs
                .Include(x => x.KhoaInfo)
                .Select(x => new
                {
                    maNganh = x.MaNganh,
                    tenNganh = x.TenNganh,
                    maKhoa = x.MaKhoa,
                    tenKhoa = x.KhoaInfo != null ? x.KhoaInfo.TenKhoa : null,
                    moTa = x.MoTa
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NganhHoc model)
        {
            _context.NganhHocs.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NganhHoc model)
        {
            var entity = await _context.NganhHocs.FindAsync(id);
            if (entity == null) return NotFound();

            entity.TenNganh = model.TenNganh;
            entity.MaKhoa = model.MaKhoa;
            entity.MoTa = model.MoTa;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.NganhHocs.FindAsync(id);
            if (entity == null) return NotFound();

            _context.NganhHocs.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoa nganh hoc thanh cong" });
        }
    }
}