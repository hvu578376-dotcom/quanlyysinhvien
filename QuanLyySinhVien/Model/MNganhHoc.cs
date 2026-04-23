using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
{
    [Table("NganhHoc")]
    public class NganhHoc
    {
        public NganhHoc()
        {
            LopHocs = new HashSet<LopHoc>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaNganh { get; set; }

        [Required]
        [StringLength(100)]
        public string TenNganh { get; set; } = string.Empty;

        [Required]
        public int MaKhoa { get; set; }

        [StringLength(200)]
        public string? MoTa { get; set; }

        [ForeignKey("MaKhoa")]
        public virtual MaKhoa? KhoaInfo { get; set; }

        public virtual ICollection<LopHoc> LopHocs { get; set; }
    }
}