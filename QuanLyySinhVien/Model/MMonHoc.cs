using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaiTapQLSV.Models
{
    [Table("MonHoc")]
    public class MonHoc
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaMonHoc { get; set; }

        [Required(ErrorMessage = "Tên môn học không được để trống")]
        [StringLength(100)]
        public string TenMonHoc { get; set; }

        [Required(ErrorMessage = "Số tín chỉ không được để trống")]
        [Range(1, 10, ErrorMessage = "Số tín chỉ phải từ 1 đến 10")]
        public int SoTinChi { get; set; }

        [StringLength(100)]
        public string? MoTa { get; set; }

        // Quan hệ với bảng Kết quả (nếu có)
        public ICollection<KetQua>? KetQuas { get; set; }
    }
}