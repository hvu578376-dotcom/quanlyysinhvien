using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaKhoaApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MaKhoaApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.MaKhoas
                .Select(x => new
                {
                    maKhoa = x.Khoa,
                    tenKhoa = x.TenKhoa,
                    moTa = x.MoTa
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MaKhoa model)
        {
            _context.MaKhoas.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MaKhoa model)
        {
            var entity = await _context.MaKhoas.FindAsync(id);
            if (entity == null) return NotFound();

            entity.TenKhoa = model.TenKhoa;
            entity.MoTa = model.MoTa;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.MaKhoas.FindAsync(id);
            if (entity == null) return NotFound();

            _context.MaKhoas.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoa khoa thanh cong" });
        }
    }
}