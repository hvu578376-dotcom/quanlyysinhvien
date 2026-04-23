using Microsoft.AspNetCore.Mvc;
using qlsinhvien.Data;

public class HomeController : Controller
{
    private readonly AppDbContext _context;

    public HomeController(AppDbContext context)
    {
        _context = context;
    }

    public IActionResult TestConnection()
    {
        bool ketNoiDuoc = _context.Database.CanConnect();

        if (ketNoiDuoc)
        {
            return Content("Kết nối MySQL thành công");
        }

        return Content("Kết nối MySQL thất bại");
    }
}