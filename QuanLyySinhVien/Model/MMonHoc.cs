using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
{
    [Table("MonHoc")]
    public class MonHoc
    {
        public MonHoc()
        {
            LopHocPhans = new HashSet<LopHocPhan>();
            PhanCongGiangDays = new HashSet<PhanCongGiangDay>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaMonHoc { get; set; }

        [Required]
        [StringLength(100)]
        public string TenMonHoc { get; set; } = string.Empty;

        [Required]
        public int SoTinChi { get; set; }

        [StringLength(255)]
        public string? MoTa { get; set; }

        public virtual ICollection<LopHocPhan> LopHocPhans { get; set; }
        public virtual ICollection<PhanCongGiangDay> PhanCongGiangDays { get; set; }
    }
}