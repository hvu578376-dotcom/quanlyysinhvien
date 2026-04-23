using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
{
    [Table("DangKyHoc")]
    public class DangKyHoc
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaDangKy { get; set; }

        [Required]
        public int MaSinhVien { get; set; }

        [Required]
        public int MaLopHocPhan { get; set; }

        public DateTime NgayDangKy { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string TrangThai { get; set; } = "DangKy";

        [ForeignKey("MaSinhVien")]
        public virtual TaiKhoan? SinhVien { get; set; }

        [ForeignKey("MaLopHocPhan")]
        public virtual LopHocPhan? LopHocPhan { get; set; }
    }
}