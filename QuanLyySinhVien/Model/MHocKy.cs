using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("HocKy")]
    public class HocKy
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaHocKy { get; set; }

        [Required]
        [StringLength(50)]
        public string TenHocKy { get; set; } // HK1, HK2

        [Required]
        [StringLength(20)]
        public string NamHoc { get; set; } // 2024-2025

        public bool TrangThai { get; set; } = true; // đang mở hay không

        // Quan hệ
        public ICollection<LopHocPhan>? LopHocPhans { get; set; }
    }
}