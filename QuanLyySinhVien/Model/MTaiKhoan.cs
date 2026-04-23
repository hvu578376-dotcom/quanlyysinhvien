using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
{
    [Table("TaiKhoan")]
    public class TaiKhoan
    {
        public TaiKhoan()
        {
            KetQuaHocTaps = new HashSet<KetQuaHocTap>();
            DangKyHocs = new HashSet<DangKyHoc>();
            LopHocPhanGiangViens = new HashSet<LopHocPhan>();
            PhanCongGiangDays = new HashSet<PhanCongGiangDay>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaTaiKhoan { get; set; }

        [Required]
        [StringLength(50)]
        public string TenDangNhap { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string MatKhau { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string VaiTro { get; set; } = string.Empty;

        public bool TrangThai { get; set; } = true;

        [StringLength(100)]
        public string? Email { get; set; }

        [Required]
        [StringLength(100)]
        public string HoTen { get; set; } = string.Empty;

        [StringLength(15)]
        public string? SoDienThoai { get; set; }

        public DateTime? NgaySinh { get; set; }

        public bool? GioiTinh { get; set; }

        [StringLength(200)]
        public string? DiaChi { get; set; }

        public int? MaLop { get; set; }

        [StringLength(100)]
        public string? ChuyenNganh { get; set; }

        [StringLength(50)]
        public string? HocVi { get; set; }

        [ForeignKey("MaLop")]
        public virtual LopHoc? LopHoc { get; set; }

        public virtual ICollection<KetQuaHocTap> KetQuaHocTaps { get; set; }
        public virtual ICollection<DangKyHoc> DangKyHocs { get; set; }
        public virtual ICollection<LopHocPhan> LopHocPhanGiangViens { get; set; }
        public virtual ICollection<PhanCongGiangDay> PhanCongGiangDays { get; set; }
    }
}