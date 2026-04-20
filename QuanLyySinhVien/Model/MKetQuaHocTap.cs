using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("KetQua")]
    public class KetQua
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaKetQua { get; set; }

        [Required]
        public int MaSinhVien { get; set; }

        [Required]
        public int MaMonHoc { get; set; }

        [Required(ErrorMessage = "Điểm không được để trống")]
        [Range(0, 10, ErrorMessage = "Điểm phải từ 0 đến 10")]
        public float Diem { get; set; }

        [StringLength(20)]
        public string? HocKy { get; set; } // Ví dụ: HK1, HK2

        [StringLength(20)]
        public string? NamHoc { get; set; } // Ví dụ: 2024-2025

        // Navigation properties
        [ForeignKey("MaSinhVien")]
        public SinhVien? SinhVien { get; set; }

        [ForeignKey("MaMonHoc")]
        public MonHoc? MonHoc { get; set; }
    }
}