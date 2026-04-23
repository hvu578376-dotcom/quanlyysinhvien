using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
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

        [Required]
        public int MaHocKy { get; set; }

        [ForeignKey("MaGiangVien")]
        public virtual TaiKhoan? GiangVien { get; set; }

        [ForeignKey("MaMonHoc")]
        public virtual MonHoc? MonHoc { get; set; }

        [ForeignKey("MaLop")]
        public virtual LopHoc? LopHoc { get; set; }

        [ForeignKey("MaHocKy")]
        public virtual HocKy? HocKy { get; set; }
    }
}