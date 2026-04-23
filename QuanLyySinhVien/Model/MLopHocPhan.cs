using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
{
    [Table("LopHocPhan")]
    public class LopHocPhan
    {
        public LopHocPhan()
        {
            DangKyHocs = new HashSet<DangKyHoc>();
            KetQuaHocTaps = new HashSet<KetQuaHocTap>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaLopHocPhan { get; set; }

        [Required]
        [StringLength(100)]
        public string TenLopHocPhan { get; set; } = string.Empty;

        [Required]
        public int MaMonHoc { get; set; }

        [Required]
        public int MaGiangVien { get; set; }

        [Required]
        public int MaHocKy { get; set; }

        public int SoLuongToiDa { get; set; } = 50;

        public DateTime? ThoiGianBatDau { get; set; }

        public DateTime? ThoiGianKetThuc { get; set; }

        [StringLength(20)]
        public string TrangThai { get; set; } = "DangMo";

        [ForeignKey("MaMonHoc")]
        public virtual MonHoc? MonHoc { get; set; }

        [ForeignKey("MaGiangVien")]
        public virtual TaiKhoan? GiangVien { get; set; }

        [ForeignKey("MaHocKy")]
        public virtual HocKy? HocKy { get; set; }

        public virtual ICollection<DangKyHoc> DangKyHocs { get; set; }
        public virtual ICollection<KetQuaHocTap> KetQuaHocTaps { get; set; }
    }
}