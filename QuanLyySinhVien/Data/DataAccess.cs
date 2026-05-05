using Microsoft.EntityFrameworkCore;
using qlsinhvien.Models;

namespace qlsinhvien.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<MaKhoa> MaKhoas { get; set; }
        public DbSet<NganhHoc> NganhHocs { get; set; }
        public DbSet<LopHoc> LopHocs { get; set; }
        public DbSet<HocKy> HocKys { get; set; }
        public DbSet<MonHoc> MonHocs { get; set; }
        public DbSet<TaiKhoan> TaiKhoans { get; set; }
        public DbSet<LopHocPhan> LopHocPhans { get; set; }
        public DbSet<DangKyHoc> DangKyHocs { get; set; }
        public DbSet<KetQuaHocTap> KetQuaHocTaps { get; set; }
        public DbSet<PhanCongGiangDay> PhanCongGiangDays { get; set; }
        public DbSet<qlsinhvien.Models.PasswordReset> PasswordResets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================
            // Bảng MaKhoa
            // =========================
            modelBuilder.Entity<MaKhoa>(entity =>
            {
                entity.ToTable("MaKhoa");

                entity.HasKey(e => e.Khoa);

                entity.Property(e => e.Khoa)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.TenKhoa)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.MoTa)
                      .HasMaxLength(200);

                entity.HasIndex(e => e.TenKhoa)
                      .IsUnique();
            });

            // =========================
            // Bảng NganhHoc
            // =========================
            modelBuilder.Entity<NganhHoc>(entity =>
            {
                entity.ToTable("NganhHoc");

                entity.HasKey(e => e.MaNganh);

                entity.Property(e => e.MaNganh)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.TenNganh)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.MoTa)
                      .HasMaxLength(200);

                entity.HasIndex(e => new { e.TenNganh, e.MaKhoa })
                      .IsUnique();

                entity.HasOne(e => e.KhoaInfo)
                      .WithMany(e => e.NganhHocs)
                      .HasForeignKey(e => e.MaKhoa)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // =========================
            // Bảng LopHoc
            // =========================
            modelBuilder.Entity<LopHoc>(entity =>
            {
                entity.ToTable("LopHoc");

                entity.HasKey(e => e.MaLop);

                entity.Property(e => e.MaLop)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.TenLop)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.Khoa)
                      .HasMaxLength(50);

                entity.Property(e => e.NienKhoa)
                      .HasMaxLength(50);

                entity.HasIndex(e => e.TenLop)
                      .IsUnique();

                entity.HasOne(e => e.NganhHoc)
                      .WithMany(e => e.LopHocs)
                      .HasForeignKey(e => e.MaNganh)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // =========================
            // Bảng HocKy
            // =========================
            modelBuilder.Entity<HocKy>(entity =>
            {
                entity.ToTable("HocKy");

                entity.HasKey(e => e.MaHocKy);

                entity.Property(e => e.MaHocKy)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.TenHocKy)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.NamHoc)
                      .IsRequired()
                      .HasMaxLength(20);

                entity.Property(e => e.TrangThai)
                      .HasDefaultValue(true);

                entity.HasIndex(e => new { e.TenHocKy, e.NamHoc })
                      .IsUnique();
            });

            // =========================
            // Bảng MonHoc
            // =========================
            modelBuilder.Entity<MonHoc>(entity =>
            {
                entity.ToTable("MonHoc");

                entity.HasKey(e => e.MaMonHoc);

                entity.Property(e => e.MaMonHoc)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.TenMonHoc)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.MoTa)
                      .HasMaxLength(255);

                entity.HasIndex(e => e.TenMonHoc)
                      .IsUnique();
            });

            // =========================
            // Bảng TaiKhoan
            // =========================
            modelBuilder.Entity<TaiKhoan>(entity =>
            {
                entity.ToTable("TaiKhoan");

                entity.HasKey(e => e.MaTaiKhoan);

                entity.Property(e => e.MaTaiKhoan)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.TenDangNhap)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.MatKhau)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.VaiTro)
                      .IsRequired()
                      .HasMaxLength(20);

                entity.Property(e => e.TrangThai)
                      .HasDefaultValue(true);

                entity.Property(e => e.Email)
                      .HasMaxLength(100);

                entity.Property(e => e.HoTen)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.SoDienThoai)
                      .HasMaxLength(15);

                entity.Property(e => e.DiaChi)
                      .HasMaxLength(200);

                entity.Property(e => e.ChuyenNganh)
                      .HasMaxLength(100);

                entity.Property(e => e.HocVi)
                      .HasMaxLength(50);

                entity.HasIndex(e => e.TenDangNhap)
                      .IsUnique();

                entity.HasIndex(e => e.Email)
                      .IsUnique();

                entity.HasIndex(e => e.SoDienThoai)
                      .IsUnique();

                entity.HasOne(e => e.LopHoc)
                      .WithMany(e => e.TaiKhoans)
                      .HasForeignKey(e => e.MaLop)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // =========================
            // Bảng LopHocPhan
            // =========================
            modelBuilder.Entity<LopHocPhan>(entity =>
            {
                entity.ToTable("LopHocPhan");

                entity.HasKey(e => e.MaLopHocPhan);

                entity.Property(e => e.MaLopHocPhan)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.TenLopHocPhan)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.SoLuongToiDa)
                      .HasDefaultValue(50);

                entity.Property(e => e.TrangThai)
                      .HasMaxLength(20)
                      .HasDefaultValue("DangMo");

                entity.HasOne(e => e.MonHoc)
                      .WithMany(e => e.LopHocPhans)
                      .HasForeignKey(e => e.MaMonHoc)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.GiangVien)
                      .WithMany(e => e.LopHocPhanGiangViens)
                      .HasForeignKey(e => e.MaGiangVien)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.HocKy)
                      .WithMany(e => e.LopHocPhans)
                      .HasForeignKey(e => e.MaHocKy)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // =========================
            // Bảng DangKyHoc
            // =========================
            modelBuilder.Entity<DangKyHoc>(entity =>
            {
                entity.ToTable("DangKyHoc");

                entity.HasKey(e => e.MaDangKy);

                entity.Property(e => e.MaDangKy)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.TrangThai)
                      .HasMaxLength(20)
                      .HasDefaultValue("DangKy");

                entity.HasIndex(e => new { e.MaSinhVien, e.MaLopHocPhan })
                      .IsUnique();

                entity.HasOne(e => e.SinhVien)
                      .WithMany(e => e.DangKyHocs)
                      .HasForeignKey(e => e.MaSinhVien)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.LopHocPhan)
                      .WithMany(e => e.DangKyHocs)
                      .HasForeignKey(e => e.MaLopHocPhan)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // =========================
            // Bảng KetQuaHocTap
            // =========================
            modelBuilder.Entity<KetQuaHocTap>(entity =>
            {
                entity.ToTable("KetQuaHocTap");

                entity.HasKey(e => e.MaKetQua);

                entity.Property(e => e.MaKetQua)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.DiemChuyenCan)
                      .HasColumnType("decimal(4,2)");

                entity.Property(e => e.DiemGiuaKy)
                      .HasColumnType("decimal(4,2)");

                entity.Property(e => e.DiemCuoiKy)
                      .HasColumnType("decimal(4,2)");

                entity.Property(e => e.DiemQuaTrinh)
                      .HasColumnType("decimal(4,2)");

                entity.Property(e => e.DiemKetThucHocPhan)
                      .HasColumnType("decimal(4,2)");

                entity.Property(e => e.DiemTongKet)
                      .HasColumnType("decimal(4,2)");

                entity.Property(e => e.KetQua)
                      .HasMaxLength(20);

                entity.HasIndex(e => new { e.MaTaiKhoan, e.MaLopHocPhan })
                      .IsUnique();

                entity.HasOne(e => e.TaiKhoan)
                      .WithMany(e => e.KetQuaHocTaps)
                      .HasForeignKey(e => e.MaTaiKhoan)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.LopHocPhan)
                      .WithMany(e => e.KetQuaHocTaps)
                      .HasForeignKey(e => e.MaLopHocPhan)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // =========================
            // Bảng PhanCongGiangDay
            // =========================
            modelBuilder.Entity<PhanCongGiangDay>(entity =>
            {
                entity.ToTable("PhanCongGiangDay");

                entity.HasKey(e => e.MaPhanCong);

                entity.Property(e => e.MaPhanCong)
                      .ValueGeneratedOnAdd();

                entity.HasIndex(e => new { e.MaGiangVien, e.MaMonHoc, e.MaLop, e.MaHocKy })
                      .IsUnique();

                entity.HasOne(e => e.GiangVien)
                      .WithMany(e => e.PhanCongGiangDays)
                      .HasForeignKey(e => e.MaGiangVien)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.MonHoc)
                      .WithMany(e => e.PhanCongGiangDays)
                      .HasForeignKey(e => e.MaMonHoc)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.LopHoc)
                      .WithMany(e => e.PhanCongGiangDays)
                      .HasForeignKey(e => e.MaLop)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.HocKy)
                      .WithMany(e => e.PhanCongGiangDays)
                      .HasForeignKey(e => e.MaHocKy)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}