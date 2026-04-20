using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("Lop")]
    public class Lop
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaLop { get; set; }

        [Required(ErrorMessage = "Tên lớp không được để trống")]
        [StringLength(50)]
        public string TenLop { get; set; }

        [StringLength(50)]
        
        public string NienKhoa { get; set; } // Ví dụ: 2022-2026
        public int? MaKhoa { get; set; }

        [ForeignKey("MaKhoa")]
        public Khoa? Khoa { get; set; }

        // Quan hệ 1 lớp - nhiều sinh viên
        public ICollection<SinhVien>? SinhViens { get; set; }
    }
}