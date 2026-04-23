using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyySinhVien.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "HocKy",
                columns: table => new
                {
                    MaHocKy = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TenHocKy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NamHoc = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TrangThai = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HocKy", x => x.MaHocKy);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MaKhoa",
                columns: table => new
                {
                    Khoa = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TenKhoa = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MoTa = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaKhoa", x => x.Khoa);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MonHoc",
                columns: table => new
                {
                    MaMonHoc = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TenMonHoc = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SoTinChi = table.Column<int>(type: "int", nullable: false),
                    MoTa = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonHoc", x => x.MaMonHoc);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "NganhHoc",
                columns: table => new
                {
                    MaNganh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TenNganh = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MaKhoa = table.Column<int>(type: "int", nullable: false),
                    MoTa = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NganhHoc", x => x.MaNganh);
                    table.ForeignKey(
                        name: "FK_NganhHoc_MaKhoa_MaKhoa",
                        column: x => x.MaKhoa,
                        principalTable: "MaKhoa",
                        principalColumn: "Khoa",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LopHoc",
                columns: table => new
                {
                    MaLop = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TenLop = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Khoa = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NienKhoa = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MaNganh = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LopHoc", x => x.MaLop);
                    table.ForeignKey(
                        name: "FK_LopHoc_NganhHoc_MaNganh",
                        column: x => x.MaNganh,
                        principalTable: "NganhHoc",
                        principalColumn: "MaNganh",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TaiKhoan",
                columns: table => new
                {
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TenDangNhap = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MatKhau = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    VaiTro = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TrangThai = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    Email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HoTen = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SoDienThoai = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NgaySinh = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    GioiTinh = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    DiaChi = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MaLop = table.Column<int>(type: "int", nullable: true),
                    ChuyenNganh = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HocVi = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoan", x => x.MaTaiKhoan);
                    table.ForeignKey(
                        name: "FK_TaiKhoan_LopHoc_MaLop",
                        column: x => x.MaLop,
                        principalTable: "LopHoc",
                        principalColumn: "MaLop",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LopHocPhan",
                columns: table => new
                {
                    MaLopHocPhan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TenLopHocPhan = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MaMonHoc = table.Column<int>(type: "int", nullable: false),
                    MaGiangVien = table.Column<int>(type: "int", nullable: false),
                    MaHocKy = table.Column<int>(type: "int", nullable: false),
                    SoLuongToiDa = table.Column<int>(type: "int", nullable: false, defaultValue: 50),
                    ThoiGianBatDau = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ThoiGianKetThuc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    TrangThai = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false, defaultValue: "DangMo")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LopHocPhan", x => x.MaLopHocPhan);
                    table.ForeignKey(
                        name: "FK_LopHocPhan_HocKy_MaHocKy",
                        column: x => x.MaHocKy,
                        principalTable: "HocKy",
                        principalColumn: "MaHocKy",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LopHocPhan_MonHoc_MaMonHoc",
                        column: x => x.MaMonHoc,
                        principalTable: "MonHoc",
                        principalColumn: "MaMonHoc",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LopHocPhan_TaiKhoan_MaGiangVien",
                        column: x => x.MaGiangVien,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PhanCongGiangDay",
                columns: table => new
                {
                    MaPhanCong = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MaGiangVien = table.Column<int>(type: "int", nullable: false),
                    MaMonHoc = table.Column<int>(type: "int", nullable: false),
                    MaLop = table.Column<int>(type: "int", nullable: false),
                    MaHocKy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhanCongGiangDay", x => x.MaPhanCong);
                    table.ForeignKey(
                        name: "FK_PhanCongGiangDay_HocKy_MaHocKy",
                        column: x => x.MaHocKy,
                        principalTable: "HocKy",
                        principalColumn: "MaHocKy",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PhanCongGiangDay_LopHoc_MaLop",
                        column: x => x.MaLop,
                        principalTable: "LopHoc",
                        principalColumn: "MaLop",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PhanCongGiangDay_MonHoc_MaMonHoc",
                        column: x => x.MaMonHoc,
                        principalTable: "MonHoc",
                        principalColumn: "MaMonHoc",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PhanCongGiangDay_TaiKhoan_MaGiangVien",
                        column: x => x.MaGiangVien,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DangKyHoc",
                columns: table => new
                {
                    MaDangKy = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MaSinhVien = table.Column<int>(type: "int", nullable: false),
                    MaLopHocPhan = table.Column<int>(type: "int", nullable: false),
                    NgayDangKy = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    TrangThai = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false, defaultValue: "DangKy")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DangKyHoc", x => x.MaDangKy);
                    table.ForeignKey(
                        name: "FK_DangKyHoc_LopHocPhan_MaLopHocPhan",
                        column: x => x.MaLopHocPhan,
                        principalTable: "LopHocPhan",
                        principalColumn: "MaLopHocPhan",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DangKyHoc_TaiKhoan_MaSinhVien",
                        column: x => x.MaSinhVien,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "KetQuaHocTap",
                columns: table => new
                {
                    MaKetQua = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: false),
                    MaLopHocPhan = table.Column<int>(type: "int", nullable: false),
                    DiemChuyenCan = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    DiemGiuaKy = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    DiemCuoiKy = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    DiemQuaTrinh = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    DiemKetThucHocPhan = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    DiemTongKet = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    KetQua = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KetQuaHocTap", x => x.MaKetQua);
                    table.ForeignKey(
                        name: "FK_KetQuaHocTap_LopHocPhan_MaLopHocPhan",
                        column: x => x.MaLopHocPhan,
                        principalTable: "LopHocPhan",
                        principalColumn: "MaLopHocPhan",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KetQuaHocTap_TaiKhoan_MaTaiKhoan",
                        column: x => x.MaTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_DangKyHoc_MaLopHocPhan",
                table: "DangKyHoc",
                column: "MaLopHocPhan");

            migrationBuilder.CreateIndex(
                name: "IX_DangKyHoc_MaSinhVien_MaLopHocPhan",
                table: "DangKyHoc",
                columns: new[] { "MaSinhVien", "MaLopHocPhan" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HocKy_TenHocKy_NamHoc",
                table: "HocKy",
                columns: new[] { "TenHocKy", "NamHoc" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KetQuaHocTap_MaLopHocPhan",
                table: "KetQuaHocTap",
                column: "MaLopHocPhan");

            migrationBuilder.CreateIndex(
                name: "IX_KetQuaHocTap_MaTaiKhoan_MaLopHocPhan",
                table: "KetQuaHocTap",
                columns: new[] { "MaTaiKhoan", "MaLopHocPhan" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LopHoc_MaNganh",
                table: "LopHoc",
                column: "MaNganh");

            migrationBuilder.CreateIndex(
                name: "IX_LopHoc_TenLop",
                table: "LopHoc",
                column: "TenLop",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LopHocPhan_MaGiangVien",
                table: "LopHocPhan",
                column: "MaGiangVien");

            migrationBuilder.CreateIndex(
                name: "IX_LopHocPhan_MaHocKy",
                table: "LopHocPhan",
                column: "MaHocKy");

            migrationBuilder.CreateIndex(
                name: "IX_LopHocPhan_MaMonHoc",
                table: "LopHocPhan",
                column: "MaMonHoc");

            migrationBuilder.CreateIndex(
                name: "IX_MaKhoa_TenKhoa",
                table: "MaKhoa",
                column: "TenKhoa",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MonHoc_TenMonHoc",
                table: "MonHoc",
                column: "TenMonHoc",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NganhHoc_MaKhoa",
                table: "NganhHoc",
                column: "MaKhoa");

            migrationBuilder.CreateIndex(
                name: "IX_NganhHoc_TenNganh_MaKhoa",
                table: "NganhHoc",
                columns: new[] { "TenNganh", "MaKhoa" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PhanCongGiangDay_MaGiangVien_MaMonHoc_MaLop_MaHocKy",
                table: "PhanCongGiangDay",
                columns: new[] { "MaGiangVien", "MaMonHoc", "MaLop", "MaHocKy" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PhanCongGiangDay_MaHocKy",
                table: "PhanCongGiangDay",
                column: "MaHocKy");

            migrationBuilder.CreateIndex(
                name: "IX_PhanCongGiangDay_MaLop",
                table: "PhanCongGiangDay",
                column: "MaLop");

            migrationBuilder.CreateIndex(
                name: "IX_PhanCongGiangDay_MaMonHoc",
                table: "PhanCongGiangDay",
                column: "MaMonHoc");

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_Email",
                table: "TaiKhoan",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_MaLop",
                table: "TaiKhoan",
                column: "MaLop");

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_SoDienThoai",
                table: "TaiKhoan",
                column: "SoDienThoai",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_TenDangNhap",
                table: "TaiKhoan",
                column: "TenDangNhap",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DangKyHoc");

            migrationBuilder.DropTable(
                name: "KetQuaHocTap");

            migrationBuilder.DropTable(
                name: "PhanCongGiangDay");

            migrationBuilder.DropTable(
                name: "LopHocPhan");

            migrationBuilder.DropTable(
                name: "HocKy");

            migrationBuilder.DropTable(
                name: "MonHoc");

            migrationBuilder.DropTable(
                name: "TaiKhoan");

            migrationBuilder.DropTable(
                name: "LopHoc");

            migrationBuilder.DropTable(
                name: "NganhHoc");

            migrationBuilder.DropTable(
                name: "MaKhoa");
        }
    }
}
