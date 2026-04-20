using BaiTapQLSV.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace BaiTapQLSV.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<TaiKhoan> TaiKhoans { get; set; }
        public DbSet<SinhVien> SinhViens { get; set; }
        public DbSet<Lop> Lops { get; set; }
        public DbSet<MonHoc> MonHocs { get; set; }
        public DbSet<GiangVien> GiangViens { get; set; }
        public DbSet<KetQua> KetQuas { get; set; }
        public DbSet<DangKyHoc> DangKyHocs { get; set; }
        public DbSet<PhanCongGiangDay> PhanCongGiangDays { get; set; }
        public DbSet<LopHocPhan> LopHocPhans { get; set; }
        public DbSet<Khoa> Khoas { get; set; }
        public DbSet<HocKy> HocKys { get; set; }
        public DbSet<DiemChiTiet> DiemChiTiets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // chống trùng đăng ký học
            modelBuilder.Entity<DangKyHoc>()
                .HasIndex(d => new { d.MaSinhVien, d.MaMonHoc, d.HocKy, d.NamHoc })
                .IsUnique();

            // chống trùng kết quả
            modelBuilder.Entity<KetQua>()
                .HasIndex(k => new { k.MaSinhVien, k.MaMonHoc, k.HocKy, k.NamHoc })
                .IsUnique();

            // chống trùng phân công
            modelBuilder.Entity<PhanCongGiangDay>()
                .HasIndex(p => new { p.MaGiangVien, p.MaMonHoc, p.MaLop, p.HocKy, p.NamHoc })
                .IsUnique();
            modelBuilder.Entity<TaiKhoan>()
                .HasIndex(t => t.TenDangNhap)
                .IsUnique();
        }
    }
}