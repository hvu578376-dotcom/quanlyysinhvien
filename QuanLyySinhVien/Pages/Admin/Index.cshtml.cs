using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace QuanLyySinhVien.Pages.Admin
{
    [Authorize(Roles = "Admin,admin,QuanTri,quantri,Quản trị")] 
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
