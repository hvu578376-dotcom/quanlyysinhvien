using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
{
    [Table("KetQuaHocTap")]
    public class KetQuaHocTap
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaKetQua { get; set; }

        [Required]
        public int MaTaiKhoan { get; set; }

        [Required]
        public int MaLopHocPhan { get; set; }

        [Column(TypeName = "decimal(4,2)")]
        public decimal? DiemChuyenCan { get; set; }

        [Column(TypeName = "decimal(4,2)")]
        public decimal? DiemGiuaKy { get; set; }

        [Column(TypeName = "decimal(4,2)")]
        public decimal? DiemCuoiKy { get; set; }

        [Column(TypeName = "decimal(4,2)")]
        public decimal? DiemQuaTrinh { get; set; }

        [Column(TypeName = "decimal(4,2)")]
        public decimal? DiemKetThucHocPhan { get; set; }

        [Column(TypeName = "decimal(4,2)")]
        public decimal? DiemTongKet { get; set; }

        [StringLength(20)]
        public string? KetQua { get; set; }

        [ForeignKey("MaTaiKhoan")]
        public virtual TaiKhoan? TaiKhoan { get; set; }

        [ForeignKey("MaLopHocPhan")]
        public virtual LopHocPhan? LopHocPhan { get; set; }
    }
}