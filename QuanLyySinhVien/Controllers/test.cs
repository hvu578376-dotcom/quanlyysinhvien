using BaiTapQLSV.Data;
using Microsoft.AspNetCore.Mvc;

public class TestController : Controller
{
    private readonly AppDbContext _context;

    public TestController(AppDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var data = _context.SinhViens.ToList();
        return Content("Kết nối OK: " + data.Count);
    }
}