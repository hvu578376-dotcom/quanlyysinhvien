using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("PhanCongGiangDay")]
    public class PhanCongGiangDay
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaPhanCong { get; set; }

        [Required]
        public int MaGiangVien { get; set; }

        [Required]
        public int MaMonHoc { get; set; }

        [Required]
        public int MaLop { get; set; }

        [StringLength(20)]
        public string? HocKy { get; set; } // HK1, HK2

        [StringLength(20)]
        public string? NamHoc { get; set; } // 2024-2025

        // Navigation properties
        [ForeignKey("MaGiangVien")]
        public GiangVien? GiangVien { get; set; }

        [ForeignKey("MaMonHoc")]
        public MonHoc? MonHoc { get; set; }

        [ForeignKey("MaLop")]
        public Lop? Lop { get; set; }
    }
}