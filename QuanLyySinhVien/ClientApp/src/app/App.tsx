import { useMemo, useState, type CSSProperties } from 'react';
import { TaiKhoan } from '../components/TaiKhoan';
import { LopHoc } from '../components/LopHoc';
import { MonHoc } from '../components/MonHoc';
import { HocKy } from '../components/HocKy';
import { MaKhoa } from '../components/MaKhoa';
import { NganhHoc } from '../components/NganhHoc';
import { LopHocPhan } from '../components/LopHocPhan';
import { DangKyHoc } from '../components/DangKyHoc';
import { KetQuaHocTap } from '../components/KetQuaHocTap';
import { PhanCongGiangDay } from '../components/PhanCongGiangDay';

type PageKey =
    | 'trangChu'
    | 'taiKhoan'
    | 'maKhoa'
    | 'nganhHoc'
    | 'lopHoc'
    | 'monHoc'
    | 'hocKy'
    | 'lopHocPhan'
    | 'dangKyHoc'
    | 'ketQuaHocTap'
    | 'phanCongGiangDay';

export default function App() {
    const [page, setPage] = useState<PageKey>('trangChu');

    const pageTitle = useMemo(() => {
        switch (page) {
            case 'trangChu':
                return 'Trang Chu';
            case 'taiKhoan':
                return 'Quan Ly Tai Khoan';
            case 'maKhoa':
                return 'Quan Ly Khoa';
            case 'nganhHoc':
                return 'Quan Ly Nganh Hoc';
            case 'lopHoc':
                return 'Quan Ly Lop Hoc';
            case 'monHoc':
                return 'Quan Ly Mon Hoc';
            case 'hocKy':
                return 'Quan Ly Hoc Ky';
            case 'lopHocPhan':
                return 'Quan Ly Lop Hoc Phan';
            case 'dangKyHoc':
                return 'Quan Ly Dang Ky Hoc';
            case 'ketQuaHocTap':
                return 'Quan Ly Ket Qua Hoc Tap';
            case 'phanCongGiangDay':
                return 'Quan Ly Phan Cong Giang Day';
            default:
                return 'Quan Ly Sinh Vien';
        }
    }, [page]);

    return (
        <div style={appWrap}>
            <aside style={sidebar}>
                <div style={brandBox}>
                    <div style={brandTitle}>QuanLySinhVien</div>
                    <div style={brandSub}>He thong quan ly</div>
                </div>

                <div style={menuSection}>
                    <div style={sectionTitle}>Tong quan</div>
                    <button
                        onClick={() => setPage('trangChu')}
                        style={page === 'trangChu' ? activeMenuButton : menuButton}
                    >
                        Trang Chu
                    </button>
                </div>

                <div style={menuSection}>
                    <div style={sectionTitle}>Danh muc</div>

                    <button
                        onClick={() => setPage('taiKhoan')}
                        style={page === 'taiKhoan' ? activeMenuButton : menuButton}
                    >
                        Tai Khoan
                    </button>

                    <button
                        onClick={() => setPage('maKhoa')}
                        style={page === 'maKhoa' ? activeMenuButton : menuButton}
                    >
                        Khoa
                    </button>

                    <button
                        onClick={() => setPage('nganhHoc')}
                        style={page === 'nganhHoc' ? activeMenuButton : menuButton}
                    >
                        Nganh Hoc
                    </button>

                    <button
                        onClick={() => setPage('lopHoc')}
                        style={page === 'lopHoc' ? activeMenuButton : menuButton}
                    >
                        Lop Hoc
                    </button>

                    <button
                        onClick={() => setPage('monHoc')}
                        style={page === 'monHoc' ? activeMenuButton : menuButton}
                    >
                        Mon Hoc
                    </button>

                    <button
                        onClick={() => setPage('hocKy')}
                        style={page === 'hocKy' ? activeMenuButton : menuButton}
                    >
                        Hoc Ky
                    </button>
                </div>

                <div style={menuSection}>
                    <div style={sectionTitle}>Nghiep vu</div>

                    <button
                        onClick={() => setPage('lopHocPhan')}
                        style={page === 'lopHocPhan' ? activeMenuButton : menuButton}
                    >
                        Lop Hoc Phan
                    </button>

                    <button
                        onClick={() => setPage('dangKyHoc')}
                        style={page === 'dangKyHoc' ? activeMenuButton : menuButton}
                    >
                        Dang Ky Hoc
                    </button>

                    <button
                        onClick={() => setPage('ketQuaHocTap')}
                        style={page === 'ketQuaHocTap' ? activeMenuButton : menuButton}
                    >
                        Ket Qua Hoc Tap
                    </button>

                    <button
                        onClick={() => setPage('phanCongGiangDay')}
                        style={page === 'phanCongGiangDay' ? activeMenuButton : menuButton}
                    >
                        Phan Cong Giang Day
                    </button>
                </div>
            </aside>

            <main style={mainContent}>
                <div style={topBar}>
                    <div>
                        <h1 style={mainTitle}>{pageTitle}</h1>
                        <p style={mainSubTitle}>Du an quan ly sinh vien</p>
                    </div>
                </div>

                {page === 'trangChu' && <HomeDashboard onNavigate={setPage} />}

                {page === 'taiKhoan' && <TaiKhoan />}
                {page === 'maKhoa' && <MaKhoa />}
                {page === 'nganhHoc' && <NganhHoc />}
                {page === 'lopHoc' && <LopHoc />}
                {page === 'monHoc' && <MonHoc />}
                {page === 'hocKy' && <HocKy />}
                {page === 'lopHocPhan' && <LopHocPhan />}
                {page === 'dangKyHoc' && <DangKyHoc />}
                {page === 'ketQuaHocTap' && <KetQuaHocTap />}
                {page === 'phanCongGiangDay' && <PhanCongGiangDay />}
            </main>
        </div>
    );
}

function HomeDashboard({
    onNavigate,
}: {
    onNavigate: (page: PageKey) => void;
}) {
    return (
        <div>
            <div style={dashboardGrid}>
                <div style={dashboardCard}>
                    <div style={cardNumber}>10</div>
                    <div style={cardTitle}>Chuc nang</div>
                </div>

            </div>

            <div style={quickActionWrap}>
                <h2 style={quickTitle}>Di nhanh den chuc nang</h2>

                <div style={quickGrid}>
                    <button style={quickButton} onClick={() => onNavigate('taiKhoan')}>
                        Quan Ly Tai Khoan
                    </button>
                    <button style={quickButton} onClick={() => onNavigate('lopHocPhan')}>
                        Quan Ly Lop Hoc Phan
                    </button>
                    <button style={quickButton} onClick={() => onNavigate('dangKyHoc')}>
                        Quan Ly Dang Ky Hoc
                    </button>
                    <button style={quickButton} onClick={() => onNavigate('ketQuaHocTap')}>
                        Quan Ly Ket Qua Hoc Tap
                    </button>
                    <button style={quickButton} onClick={() => onNavigate('phanCongGiangDay')}>
                        Quan Ly Phan Cong Giang Day
                    </button>
                    <button style={quickButton} onClick={() => onNavigate('maKhoa')}>
                        Quan Ly Khoa
                    </button>
                </div>
            </div>
        </div>
    );
}

const appWrap: CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: '#f3f6fb',
};

const sidebar: CSSProperties = {
    width: '280px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #dbe3ee',
    padding: '20px 16px',
    boxSizing: 'border-box',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
};

const brandBox: CSSProperties = {
    padding: '14px 12px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
    color: '#ffffff',
    marginBottom: '20px',
};

const brandTitle: CSSProperties = {
    fontSize: '22px',
    fontWeight: 800,
};

const brandSub: CSSProperties = {
    marginTop: '4px',
    fontSize: '14px',
    opacity: 0.95,
};

const menuSection: CSSProperties = {
    marginBottom: '22px',
};

const sectionTitle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 800,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: '10px',
    paddingLeft: '6px',
};

const menuButton: CSSProperties = {
    width: '100%',
    textAlign: 'left',
    padding: '11px 12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontWeight: 700,
    marginBottom: '6px',
    color: '#1f2937',
};

const activeMenuButton: CSSProperties = {
    width: '100%',
    textAlign: 'left',
    padding: '11px 12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#1976d2',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700,
    marginBottom: '6px',
};

const mainContent: CSSProperties = {
    flex: 1,
    padding: '24px',
    boxSizing: 'border-box',
    overflowX: 'auto',
};

const topBar: CSSProperties = {
    marginBottom: '18px',
};

const mainTitle: CSSProperties = {
    margin: 0,
    fontSize: '34px',
    fontWeight: 800,
    color: '#111827',
};

const mainSubTitle: CSSProperties = {
    margin: '6px 0 0 0',
    color: '#6b7280',
    fontSize: '15px',
};

const dashboardGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '16px',
    marginBottom: '20px',
};

const dashboardCard: CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #dbe3ee',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
};

const cardNumber: CSSProperties = {
    fontSize: '28px',
    fontWeight: 800,
    color: '#1976d2',
    marginBottom: '8px',
};

const cardTitle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 800,
    marginBottom: '6px',
    color: '#111827',
};

const cardDesc: CSSProperties = {
    color: '#6b7280',
    fontSize: '14px',
};

const quickActionWrap: CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #dbe3ee',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
};

const quickTitle: CSSProperties = {
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '24px',
};

const quickGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '12px',
};

const quickButton: CSSProperties = {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #cfe0f7',
    backgroundColor: '#f8fbff',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#0f4fa8',
};