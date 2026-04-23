using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
{
    [Table("LopHoc")]
    public class LopHoc
    {
        public LopHoc()
        {
            TaiKhoans = new HashSet<TaiKhoan>();
            PhanCongGiangDays = new HashSet<PhanCongGiangDay>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaLop { get; set; }

        [Required]
        [StringLength(50)]
        public string TenLop { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Khoa { get; set; }

        [StringLength(50)]
        public string? NienKhoa { get; set; }

        public int? MaNganh { get; set; }

        [ForeignKey("MaNganh")]
        public virtual NganhHoc? NganhHoc { get; set; }

        public virtual ICollection<TaiKhoan> TaiKhoans { get; set; }
        public virtual ICollection<PhanCongGiangDay> PhanCongGiangDays { get; set; }
    }
}