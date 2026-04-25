using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonHocApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MonHocApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.MonHocs
                .Select(x => new
                {
                    maMonHoc = x.MaMonHoc,
                    tenMonHoc = x.TenMonHoc,
                    moTa = x.MoTa
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MonHoc model)
        {
            _context.MonHocs.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MonHoc model)
        {
            var entity = await _context.MonHocs.FindAsync(id);
            if (entity == null) return NotFound();

            entity.TenMonHoc = model.TenMonHoc;
            entity.MoTa = model.MoTa;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.MonHocs.FindAsync(id);
            if (entity == null) return NotFound();

            _context.MonHocs.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoa mon hoc thanh cong" });
        }
    }
}