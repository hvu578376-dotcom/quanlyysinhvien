using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
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
        public int MaMonHoc { get; set; }

        [Required]
        [StringLength(20)]
        public string HocKy { get; set; } // HK1, HK2

        [Required]
        [StringLength(20)]
        public string NamHoc { get; set; } // 2024-2025

        public DateTime NgayDangKy { get; set; } = DateTime.Now;

        // Navigation
        [ForeignKey("MaSinhVien")]
        public SinhVien? SinhVien { get; set; }

        [ForeignKey("MaMonHoc")]
        public MonHoc? MonHoc { get; set; }
    }
}