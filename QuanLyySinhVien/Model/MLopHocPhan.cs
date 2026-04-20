using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("LopHocPhan")]
    public class LopHocPhan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaLopHocPhan { get; set; }

        [Required(ErrorMessage = "Tên lớp học phần không được để trống")]
        [StringLength(100)]
        public string TenLopHocPhan { get; set; }

        [Required]
        public int MaMonHoc { get; set; }

        [Required]
        public int MaGiangVien { get; set; }

        [StringLength(20)]
        public int? MaHocKy { get; set; }

        [ForeignKey("MaHocKy")]
        public HocKy? HocKy { get; set; }

        public int SoLuongToiDa { get; set; } = 50;

        // Navigation
        [ForeignKey("MaMonHoc")]
        public MonHoc? MonHoc { get; set; }

        [ForeignKey("MaGiangVien")]
        public GiangVien? GiangVien { get; set; }
    }
}