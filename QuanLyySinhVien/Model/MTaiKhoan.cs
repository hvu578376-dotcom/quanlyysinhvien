using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("TaiKhoan")]
    public class TaiKhoan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaTaiKhoan { get; set; }

        [Required(ErrorMessage = "Tên đăng nhập không được để trống")]
        [StringLength(50)]
        public string TenDangNhap { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [StringLength(100)]
        public string MatKhau { get; set; }

        [StringLength(20)]
        public string? VaiTro { get; set; } // Admin, GiangVien, SinhVien

        public bool TrangThai { get; set; } = true; // true: hoạt động

        // Liên kết (tùy chọn)
        public int? MaSinhVien { get; set; }
        public int? MaGiangVien { get; set; }

        [ForeignKey("MaSinhVien")]
        public SinhVien? SinhVien { get; set; }

        [ForeignKey("MaGiangVien")]
        public GiangVien? GiangVien { get; set; }
    }
}