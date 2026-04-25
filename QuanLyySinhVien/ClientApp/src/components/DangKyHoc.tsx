import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type CSSProperties,
} from 'react';

type DangKyHocItem = {
    maDangKy: number;
    maSinhVien: number;
    tenSinhVien: string | null;
    maLopHocPhan: number;
    tenLopHocPhan: string | null;
    ngayDangKy: string;
    trangThai: string;
};

type TaiKhoanOption = {
    maTaiKhoan: number;
    hoTen: string;
    vaiTro: string;
};

type LopHocPhanOption = {
    maLopHocPhan: number;
    tenLopHocPhan: string;
};

type DangKyHocForm = {
    maSinhVien: string;
    maLopHocPhan: string;
    ngayDangKy: string;
    trangThai: string;
};

const API_URL = 'https://localhost:7242/api/DangKyHocApi';
const TAIKHOAN_API_URL = 'https://localhost:7242/api/TaiKhoanApi';
const LOPHOCPHAN_API_URL = 'https://localhost:7242/api/LopHocPhanApi';

const emptyForm: DangKyHocForm = {
    maSinhVien: '',
    maLopHocPhan: '',
    ngayDangKy: '',
    trangThai: 'DangKy',
};

function toDateTimeLocalValue(value: string | null) {
    if (!value) return '';
    return value.slice(0, 16);
}

export function DangKyHoc() {
    const [data, setData] = useState<DangKyHocItem[]>([]);
    const [sinhVienOptions, setSinhVienOptions] = useState<TaiKhoanOption[]>([]);
    const [lopHocPhanOptions, setLopHocPhanOptions] = useState<LopHocPhanOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<DangKyHocForm>(emptyForm);

    useEffect(() => {
        loadAll();
    }, []);

    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return data;

        return data.filter((item) => {
            return (
                String(item.maDangKy).toLowerCase().includes(keyword) ||
                String(item.maSinhVien).toLowerCase().includes(keyword) ||
                (item.tenSinhVien ?? '').toLowerCase().includes(keyword) ||
                String(item.maLopHocPhan).toLowerCase().includes(keyword) ||
                (item.tenLopHocPhan ?? '').toLowerCase().includes(keyword) ||
                (item.trangThai ?? '').toLowerCase().includes(keyword)
            );
        });
    }, [data, searchTerm]);

    const loadAll = async () => {
        try {
            setLoading(true);
            setError('');

            const [dangKyRes, taiKhoanRes, lopHocPhanRes] = await Promise.all([
                fetch(API_URL),
                fetch(TAIKHOAN_API_URL),
                fetch(LOPHOCPHAN_API_URL),
            ]);

            if (!dangKyRes.ok) throw new Error('Khong lay duoc du lieu dang ky hoc');
            if (!taiKhoanRes.ok) throw new Error('Khong lay duoc du lieu tai khoan');
            if (!lopHocPhanRes.ok) throw new Error('Khong lay duoc du lieu lop hoc phan');

            const dangKyData = await dangKyRes.json();
            const taiKhoanData = await taiKhoanRes.json();
            const lopHocPhanData = await lopHocPhanRes.json();

            const sinhViens = taiKhoanData.filter(
                (x: TaiKhoanOption) =>
                    (x.vaiTro ?? '').toLowerCase().includes('sinh')
            );

            setData(dangKyData);
            setSinhVienOptions(sinhViens.length > 0 ? sinhViens : taiKhoanData);
            setLopHocPhanOptions(lopHocPhanData);
        } catch (err) {
            console.error(err);
            setError('Khong ket noi duoc API DangKyHoc');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const clearNotice = () => {
        setMessage('');
        setMessageType('');
    };

    const showSuccess = (text: string) => {
        setMessage(text);
        setMessageType('success');
    };

    const showError = (text: string) => {
        setMessage(text);
        setMessageType('error');
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (item: DangKyHocItem) => {
        clearNotice();
        setEditingId(item.maDangKy);

        setForm({
            maSinhVien: String(item.maSinhVien),
            maLopHocPhan: String(item.maLopHocPhan),
            ngayDangKy: toDateTimeLocalValue(item.ngayDangKy),
            trangThai: item.trangThai ?? 'DangKy',
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        resetForm();
        clearNotice();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearNotice();

        if (!form.maSinhVien) {
            showError('Ban phai chon sinh vien');
            return;
        }

        if (!form.maLopHocPhan) {
            showError('Ban phai chon lop hoc phan');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                maSinhVien: Number(form.maSinhVien),
                maLopHocPhan: Number(form.maLopHocPhan),
                ngayDangKy: form.ngayDangKy || new Date().toISOString(),
                trangThai: form.trangThai.trim() || 'DangKy',
            };

            const isEdit = editingId !== null;

            const res = await fetch(isEdit ? `${API_URL}/${editingId}` : API_URL, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(
                    isEdit ? 'Sua dang ky hoc that bai' : 'Them dang ky hoc that bai'
                );
            }

            showSuccess(
                isEdit ? 'Sua dang ky hoc thanh cong' : 'Them dang ky hoc thanh cong'
            );
            resetForm();
            await loadAll();
        } catch (err) {
            console.error(err);
            showError(
                editingId !== null
                    ? 'Sua dang ky hoc that bai'
                    : 'Them dang ky hoc that bai'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Ban co chac muon xoa dang ky hoc nay khong?');
        if (!ok) return;

        clearNotice();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Xoa dang ky hoc that bai');
            }

            if (editingId === id) resetForm();

            showSuccess('Xoa dang ky hoc thanh cong');
            await loadAll();
        } catch (err) {
            console.error(err);
            showError('Xoa dang ky hoc that bai');
        }
    };

    return (
        <div style={page}>
            <h1 style={pageTitle}>Quan Ly Dang Ky Hoc</h1>

            <form onSubmit={handleSubmit} style={card}>
                <div style={formHeaderRow}>
                    <h2 style={cardTitle}>
                        {editingId !== null ? 'Sua dang ky hoc' : 'Them dang ky hoc moi'}
                    </h2>

                    {editingId !== null && (
                        <span style={editBadge}>Dang sua Ma Dang Ky: {editingId}</span>
                    )}
                </div>

                <div style={grid}>
                    <div>
                        <label style={label}>Sinh vien</label>
                        <select
                            name="maSinhVien"
                            value={form.maSinhVien}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="">-- Chon sinh vien --</option>
                            {sinhVienOptions.map((item) => (
                                <option key={item.maTaiKhoan} value={item.maTaiKhoan}>
                                    {item.hoTen} - {item.vaiTro}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={label}>Lop hoc phan</label>
                        <select
                            name="maLopHocPhan"
                            value={form.maLopHocPhan}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="">-- Chon lop hoc phan --</option>
                            {lopHocPhanOptions.map((item) => (
                                <option key={item.maLopHocPhan} value={item.maLopHocPhan}>
                                    {item.tenLopHocPhan}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={label}>Ngay dang ky</label>
                        <input
                            name="ngayDangKy"
                            type="datetime-local"
                            value={form.ngayDangKy}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Trang thai</label>
                        <select
                            name="trangThai"
                            value={form.trangThai}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="DangKy">DangKy</option>
                            <option value="Huy">Huy</option>
                        </select>
                    </div>
                </div>

                <div style={buttonRow}>
                    <button type="submit" disabled={saving} style={primaryButton}>
                        {saving
                            ? 'Dang luu...'
                            : editingId !== null
                                ? 'Cap nhat dang ky hoc'
                                : 'Them dang ky hoc'}
                    </button>

                    {editingId !== null && (
                        <button type="button" onClick={handleCancelEdit} style={secondaryButton}>
                            Huy sua
                        </button>
                    )}
                </div>

                {message && (
                    <div style={messageType === 'success' ? successMessageBox : errorMessageBox}>
                        {message}
                    </div>
                )}
            </form>

            <div style={card}>
                <div style={topBar}>
                    <h2 style={cardTitle}>Danh sach dang ky hoc</h2>

                    <input
                        placeholder="Tim theo sinh vien, lop hoc phan, trang thai..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={searchInput}
                    />
                </div>

                {loading && <p>Dang tai du lieu...</p>}
                {error && <p style={{ color: '#c62828' }}>{error}</p>}

                {!loading && !error && (
                    <>
                        <p style={{ marginBottom: '12px' }}>
                            So dang ky hoc: <strong>{filteredData.length}</strong>
                        </p>

                        <div style={tableWrapper}>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={th}>Ma DK</th>
                                        <th style={th}>Sinh Vien</th>
                                        <th style={th}>Lop Hoc Phan</th>
                                        <th style={th}>Ngay Dang Ky</th>
                                        <th style={th}>Trang Thai</th>
                                        <th style={th}>Thao tac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={emptyCell}>
                                                Khong co du lieu phu hop
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.maDangKy}>
                                                <td style={td}>{item.maDangKy}</td>
                                                <td style={td}>{item.tenSinhVien}</td>
                                                <td style={td}>{item.tenLopHocPhan}</td>
                                                <td style={td}>{item.ngayDangKy?.replace('T', ' ')}</td>
                                                <td style={td}>{item.trangThai}</td>
                                                <td style={td}>
                                                    <div style={actionRow}>
                                                        <button onClick={() => handleEdit(item)} style={editButton}>
                                                            Sua
                                                        </button>
                                                        <button onClick={() => handleDelete(item.maDangKy)} style={deleteButton}>
                                                            Xoa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const page: CSSProperties = {
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f7fb',
    minHeight: '100vh',
};

const pageTitle: CSSProperties = {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '40px',
};

const card: CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #dfe3eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const cardTitle: CSSProperties = {
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '28px',
};

const formHeaderRow: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
};

const editBadge: CSSProperties = {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    padding: '8px 12px',
    borderRadius: '999px',
    fontWeight: 700,
};

const grid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '14px',
};

const label: CSSProperties = {
    display: 'block',
    fontWeight: 700,
    marginBottom: '6px',
};

const input: CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cfd8dc',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
};

const buttonRow: CSSProperties = {
    marginTop: '16px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
};

const primaryButton: CSSProperties = {
    padding: '10px 16px',
    cursor: 'pointer',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
};

const secondaryButton: CSSProperties = {
    padding: '10px 16px',
    cursor: 'pointer',
    backgroundColor: '#eceff1',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
};

const successMessageBox: CSSProperties = {
    marginTop: '14px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontWeight: 700,
};

const errorMessageBox: CSSProperties = {
    marginTop: '14px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    fontWeight: 700,
};

const topBar: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '12px',
};

const searchInput: CSSProperties = {
    minWidth: '320px',
    maxWidth: '460px',
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cfd8dc',
    borderRadius: '8px',
    boxSizing: 'border-box',
};

const tableWrapper: CSSProperties = {
    overflowX: 'auto',
};

const table: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
};

const th: CSSProperties = {
    border: '1px solid #d6dbe1',
    padding: '10px',
    background: '#f3f6fa',
    textAlign: 'left',
};

const td: CSSProperties = {
    border: '1px solid #d6dbe1',
    padding: '10px',
    verticalAlign: 'middle',
};

const emptyCell: CSSProperties = {
    border: '1px solid #d6dbe1',
    padding: '16px',
    textAlign: 'center',
    color: '#666',
};

const actionRow: CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
};

const editButton: CSSProperties = {
    padding: '6px 12px',
    cursor: 'pointer',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 700,
};

const deleteButton: CSSProperties = {
    padding: '6px 12px',
    cursor: 'pointer',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 700,
};