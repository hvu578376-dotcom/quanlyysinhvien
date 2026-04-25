using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HocKyApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HocKyApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.HocKys
                .Select(x => new
                {
                    maHocKy = x.MaHocKy,
                    tenHocKy = x.TenHocKy,
                    namHoc = x.NamHoc,
                    trangThai = x.TrangThai
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HocKy model)
        {
            _context.HocKys.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] HocKy model)
        {
            var entity = await _context.HocKys.FindAsync(id);
            if (entity == null) return NotFound();

            entity.TenHocKy = model.TenHocKy;
            entity.NamHoc = model.NamHoc;
            entity.TrangThai = model.TrangThai;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.HocKys.FindAsync(id);
            if (entity == null) return NotFound();

            _context.HocKys.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoa hoc ky thanh cong" });
        }
    }
}