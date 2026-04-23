using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
{
    [Table("HocKy")]
    public class HocKy
    {
        public HocKy()
        {
            LopHocPhans = new HashSet<LopHocPhan>();
            PhanCongGiangDays = new HashSet<PhanCongGiangDay>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaHocKy { get; set; }

        [Required]
        [StringLength(50)]
        public string TenHocKy { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string NamHoc { get; set; } = string.Empty;

        public bool TrangThai { get; set; } = true;

        public virtual ICollection<LopHocPhan> LopHocPhans { get; set; }
        public virtual ICollection<PhanCongGiangDay> PhanCongGiangDays { get; set; }
    }
}