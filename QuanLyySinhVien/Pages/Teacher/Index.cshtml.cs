using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace QuanLyySinhVien.Pages.Teacher
{
    [Authorize(Roles = "GiangVien,giangvien,Giảng viên,giảng viên")] 
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
