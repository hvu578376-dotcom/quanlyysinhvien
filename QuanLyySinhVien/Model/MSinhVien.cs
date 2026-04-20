using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("SinhVien")]
    public class SinhVien
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaSinhVien { get; set; }

        [Required(ErrorMessage = "Họ tên không được để trống")]
        [StringLength(100)]
        public string HoTen { get; set; }

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        [Phone]
        public string SoDienThoai { get; set; }

        [Required(ErrorMessage = "Ngày sinh không được để trống")]
        [DataType(DataType.Date)]
        public DateTime NgaySinh { get; set; }

        [Required]
        public bool GioiTinh { get; set; } // true: Nam, false: Nữ

        [StringLength(200)]
        public string DiaChi { get; set; }

        // Khóa ngoại (nếu có bảng Lớp)
        public int? MaLop { get; set; }

        [ForeignKey("MaLop")]
        public Lop? Lop { get; set; }
    }
}