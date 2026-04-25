using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using qlsinhvien.Models;

namespace qlsinhvien.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KetQuaHocTapApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KetQuaHocTapApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.KetQuaHocTaps
                .Include(x => x.TaiKhoan)
                .Include(x => x.LopHocPhan)
                .Select(x => new
                {
                    maKetQua = x.MaKetQua,
                    maTaiKhoan = x.MaTaiKhoan,
                    tenSinhVien = x.TaiKhoan != null ? x.TaiKhoan.HoTen : null,
                    maLopHocPhan = x.MaLopHocPhan,
                    tenLopHocPhan = x.LopHocPhan != null ? x.LopHocPhan.TenLopHocPhan : null,
                    diemChuyenCan = x.DiemChuyenCan,
                    diemGiuaKy = x.DiemGiuaKy,
                    diemCuoiKy = x.DiemCuoiKy,
                    diemQuaTrinh = x.DiemQuaTrinh,
                    diemKetThucHocPhan = x.DiemKetThucHocPhan,
                    diemTongKet = x.DiemTongKet,
                    ketQua = x.KetQua
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] KetQuaHocTap model)
        {
            _context.KetQuaHocTaps.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] KetQuaHocTap model)
        {
            var entity = await _context.KetQuaHocTaps.FindAsync(id);
            if (entity == null) return NotFound();

            entity.MaTaiKhoan = model.MaTaiKhoan;
            entity.MaLopHocPhan = model.MaLopHocPhan;
            entity.DiemChuyenCan = model.DiemChuyenCan;
            entity.DiemGiuaKy = model.DiemGiuaKy;
            entity.DiemCuoiKy = model.DiemCuoiKy;
            entity.DiemQuaTrinh = model.DiemQuaTrinh;
            entity.DiemKetThucHocPhan = model.DiemKetThucHocPhan;
            entity.DiemTongKet = model.DiemTongKet;
            entity.KetQua = model.KetQua;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.KetQuaHocTaps.FindAsync(id);
            if (entity == null) return NotFound();

            _context.KetQuaHocTaps.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoa ket qua hoc tap thanh cong" });
        }
    }
}