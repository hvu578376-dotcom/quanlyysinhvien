using System;
using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using qlsinhvien.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// Add cookie authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Login";
        options.Cookie.Name = "QuanLySV.Auth";
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        // Make cookie available across ports on localhost and allow cross-site requests from the SPA
        options.Cookie.Domain = "localhost";
        options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;
        options.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.Always;
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        // Allow the SPA running on localhost:5173 to call APIs and send cookies
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseRouting();

app.UseCors("AllowReact");

// Authentication must come before Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();
app.MapDefaultControllerRoute();

// Serve simplified SPA from wwwroot/app when available
var spaApp = Path.Combine(builder.Environment.ContentRootPath ?? "", "wwwroot", "app");
if (Directory.Exists(spaApp))
{
    var spaProvider = new PhysicalFileProvider(spaApp);

    // Serve default files (index.html) and static assets from wwwroot/app
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = spaProvider, RequestPath = "" });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = spaProvider, RequestPath = "" });

    // Fallback: for non-file, non-api requests, require authentication then serve index.html
    // Allow unauthenticated access to login, logout, forgot/reset password pages so users can recover account
    app.MapWhen(context =>
    {
        var path = context.Request.Path.Value ?? string.Empty;
        // if request targets api, login/logout/forgot/reset endpoints, or has extension, skip SPA fallback
        if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/Login", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/Logout", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/ForgotPassword", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/ResetPassword", StringComparison.OrdinalIgnoreCase)
            || Path.HasExtension(path))
            return false;
        return true;
    }, builderApp =>
    {
        builderApp.Run(async context =>
        {
            if (context.User?.Identity?.IsAuthenticated != true)
            {
                context.Response.Redirect("/Login");
                return;
            }

            context.Response.ContentType = "text/html";
            await context.Response.SendFileAsync(Path.Combine(spaApp, "index.html"));
        });
    });
}

app.Run();