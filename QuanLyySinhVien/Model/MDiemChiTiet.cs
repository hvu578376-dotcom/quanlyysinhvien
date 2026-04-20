using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("DiemChiTiet")]
    public class DiemChiTiet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaDiemChiTiet { get; set; }

        [Required]
        public int MaSinhVien { get; set; }

        [Required]
        public int MaLopHocPhan { get; set; }

        public float? DiemChuyenCan { get; set; }
        public float? DiemGiuaKy { get; set; }
        public float? DiemCuoiKy { get; set; }

        // Điểm tổng (có thể tự tính)
        public float? DiemTong { get; set; }

        // Navigation
        [ForeignKey("MaSinhVien")]
        public SinhVien? SinhVien { get; set; }

        [ForeignKey("MaLopHocPhan")]
        public LopHocPhan? LopHocPhan { get; set; }
    }
}