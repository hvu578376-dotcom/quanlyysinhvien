using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qlsinhvien.Models
{
    [Table("MaKhoa")]
    public class MaKhoa
    {
        public MaKhoa()
        {
            NganhHocs = new HashSet<NganhHoc>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Khoa { get; set; }

        [Required]
        [StringLength(100)]
        public string TenKhoa { get; set; } = string.Empty;

        [StringLength(200)]
        public string? MoTa { get; set; }

        public virtual ICollection<NganhHoc> NganhHocs { get; set; }
    }
}