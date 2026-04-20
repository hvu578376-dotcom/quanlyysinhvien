using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("Khoa")]
    public class Khoa
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaKhoa { get; set; }

        [Required(ErrorMessage = "Tên khoa không được để trống")]
        [StringLength(100)]
        public string TenKhoa { get; set; }

        [StringLength(200)]
        public string? MoTa { get; set; }

        // Quan hệ: 1 khoa có nhiều lớp
        public ICollection<Lop>? Lops { get; set; }

        // Quan hệ: 1 khoa có nhiều giảng viên
        public ICollection<GiangVien>? GiangViens { get; set; }
    }
}