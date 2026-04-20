using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("GiangVien")]
    public class GiangVien
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaGiangVien { get; set; }

        [Required(ErrorMessage = "Họ tên không được để trống")]
        [StringLength(100)]
        public string HoTen { get; set; }

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string? SoDienThoai { get; set; }

        [StringLength(100)]
        public string? ChuyenNganh { get; set; } // Ví dụ: CNTT, Toán

        [StringLength(50)]
        public string? HocVi { get; set; } // ThS, TS,...
        public int? MaKhoa { get; set; }

        [ForeignKey("MaKhoa")]
        public Khoa? Khoa { get; set; }

        // Quan hệ với môn học (1 giảng viên dạy nhiều môn)
        public ICollection<MonHoc>? MonHocs { get; set; }
    }
}