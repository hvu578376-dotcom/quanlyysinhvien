import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type CSSProperties,
} from 'react';

type LopHocPhanItem = {
    maLopHocPhan: number;
    tenLopHocPhan: string;
    maMonHoc: number;
    tenMonHoc: string | null;
    maGiangVien: number;
    tenGiangVien: string | null;
    maHocKy: number;
    tenHocKy: string | null;
    namHoc: string | null;
    soLuongToiDa: number;
    thoiGianBatDau: string | null;
    thoiGianKetThuc: string | null;
    trangThai: string;
};

type MonHocOption = {
    maMonHoc: number;
    tenMonHoc: string;
};

type HocKyOption = {
    maHocKy: number;
    tenHocKy: string;
    namHoc: string;
};

type TaiKhoanOption = {
    maTaiKhoan: number;
    hoTen: string;
    vaiTro: string;
};

type LopHocPhanForm = {
    tenLopHocPhan: string;
    maMonHoc: string;
    maGiangVien: string;
    maHocKy: string;
    soLuongToiDa: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    trangThai: string;
};

const API_URL = 'https://localhost:7242/api/LopHocPhanApi';
const MONHOC_API_URL = 'https://localhost:7242/api/MonHocApi';
const HOCKY_API_URL = 'https://localhost:7242/api/HocKyApi';
const TAIKHOAN_API_URL = 'https://localhost:7242/api/TaiKhoanApi';

const emptyForm: LopHocPhanForm = {
    tenLopHocPhan: '',
    maMonHoc: '',
    maGiangVien: '',
    maHocKy: '',
    soLuongToiDa: '50',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
    trangThai: 'DangMo',
};

function toDateTimeLocalValue(value: string | null) {
    if (!value) return '';
    return value.slice(0, 16);
}

export function LopHocPhan() {
    const [data, setData] = useState<LopHocPhanItem[]>([]);
    const [monHocOptions, setMonHocOptions] = useState<MonHocOption[]>([]);
    const [hocKyOptions, setHocKyOptions] = useState<HocKyOption[]>([]);
    const [taiKhoanOptions, setTaiKhoanOptions] = useState<TaiKhoanOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<LopHocPhanForm>(emptyForm);

    useEffect(() => {
        loadAll();
    }, []);

    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return data;

        return data.filter((item) => {
            return (
                String(item.maLopHocPhan).toLowerCase().includes(keyword) ||
                (item.tenLopHocPhan ?? '').toLowerCase().includes(keyword) ||
                (item.tenMonHoc ?? '').toLowerCase().includes(keyword) ||
                (item.tenGiangVien ?? '').toLowerCase().includes(keyword) ||
                (item.tenHocKy ?? '').toLowerCase().includes(keyword) ||
                (item.namHoc ?? '').toLowerCase().includes(keyword) ||
                (item.trangThai ?? '').toLowerCase().includes(keyword)
            );
        });
    }, [data, searchTerm]);

    const loadAll = async () => {
        try {
            setLoading(true);
            setError('');

            const [lopHocPhanRes, monHocRes, hocKyRes, taiKhoanRes] = await Promise.all([
                fetch(API_URL),
                fetch(MONHOC_API_URL),
                fetch(HOCKY_API_URL),
                fetch(TAIKHOAN_API_URL),
            ]);

            if (!lopHocPhanRes.ok) throw new Error('Khong lay duoc du lieu lop hoc phan');
            if (!monHocRes.ok) throw new Error('Khong lay duoc du lieu mon hoc');
            if (!hocKyRes.ok) throw new Error('Khong lay duoc du lieu hoc ky');
            if (!taiKhoanRes.ok) throw new Error('Khong lay duoc du lieu tai khoan');

            const lopHocPhanData = await lopHocPhanRes.json();
            const monHocData = await monHocRes.json();
            const hocKyData = await hocKyRes.json();
            const taiKhoanData = await taiKhoanRes.json();

            setData(lopHocPhanData);
            setMonHocOptions(monHocData);
            setHocKyOptions(hocKyData);
            setTaiKhoanOptions(taiKhoanData);
        } catch (err) {
            console.error(err);
            setError('Khong ket noi duoc API LopHocPhan');
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

    const handleEdit = (item: LopHocPhanItem) => {
        clearNotice();
        setEditingId(item.maLopHocPhan);

        setForm({
            tenLopHocPhan: item.tenLopHocPhan ?? '',
            maMonHoc: String(item.maMonHoc),
            maGiangVien: String(item.maGiangVien),
            maHocKy: String(item.maHocKy),
            soLuongToiDa: String(item.soLuongToiDa),
            thoiGianBatDau: toDateTimeLocalValue(item.thoiGianBatDau),
            thoiGianKetThuc: toDateTimeLocalValue(item.thoiGianKetThuc),
            trangThai: item.trangThai ?? 'DangMo',
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

        if (!form.tenLopHocPhan.trim()) {
            showError('Ten lop hoc phan khong duoc de trong');
            return;
        }

        if (!form.maMonHoc) {
            showError('Ban phai chon mon hoc');
            return;
        }

        if (!form.maGiangVien) {
            showError('Ban phai chon giang vien');
            return;
        }

        if (!form.maHocKy) {
            showError('Ban phai chon hoc ky');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                tenLopHocPhan: form.tenLopHocPhan.trim(),
                maMonHoc: Number(form.maMonHoc),
                maGiangVien: Number(form.maGiangVien),
                maHocKy: Number(form.maHocKy),
                soLuongToiDa: form.soLuongToiDa === '' ? 50 : Number(form.soLuongToiDa),
                thoiGianBatDau: form.thoiGianBatDau || null,
                thoiGianKetThuc: form.thoiGianKetThuc || null,
                trangThai: form.trangThai.trim() || 'DangMo',
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
                    isEdit ? 'Sua lop hoc phan that bai' : 'Them lop hoc phan that bai'
                );
            }

            showSuccess(
                isEdit
                    ? 'Sua lop hoc phan thanh cong'
                    : 'Them lop hoc phan thanh cong'
            );
            resetForm();
            await loadAll();
        } catch (err) {
            console.error(err);
            showError(
                editingId !== null
                    ? 'Sua lop hoc phan that bai'
                    : 'Them lop hoc phan that bai'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Ban co chac muon xoa lop hoc phan nay khong?');
        if (!ok) return;

        clearNotice();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Xoa lop hoc phan that bai');
            }

            if (editingId === id) resetForm();

            showSuccess('Xoa lop hoc phan thanh cong');
            await loadAll();
        } catch (err) {
            console.error(err);
            showError('Xoa lop hoc phan that bai');
        }
    };

    return (
        <div style={page}>
            <h1 style={pageTitle}>Quan Ly Lop Hoc Phan</h1>

            <form onSubmit={handleSubmit} style={card}>
                <div style={formHeaderRow}>
                    <h2 style={cardTitle}>
                        {editingId !== null ? 'Sua lop hoc phan' : 'Them lop hoc phan moi'}
                    </h2>

                    {editingId !== null && (
                        <span style={editBadge}>
                            Dang sua Ma Lop Hoc Phan: {editingId}
                        </span>
                    )}
                </div>

                <div style={grid}>
                    <div>
                        <label style={label}>Ten lop hoc phan</label>
                        <input
                            name="tenLopHocPhan"
                            value={form.tenLopHocPhan}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Mon hoc</label>
                        <select
                            name="maMonHoc"
                            value={form.maMonHoc}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="">-- Chon mon hoc --</option>
                            {monHocOptions.map((item) => (
                                <option key={item.maMonHoc} value={item.maMonHoc}>
                                    {item.tenMonHoc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={label}>Giang vien</label>
                        <select
                            name="maGiangVien"
                            value={form.maGiangVien}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="">-- Chon giang vien --</option>
                            {taiKhoanOptions.map((item) => (
                                <option key={item.maTaiKhoan} value={item.maTaiKhoan}>
                                    {item.hoTen} - {item.vaiTro}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={label}>Hoc ky</label>
                        <select
                            name="maHocKy"
                            value={form.maHocKy}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="">-- Chon hoc ky --</option>
                            {hocKyOptions.map((item) => (
                                <option key={item.maHocKy} value={item.maHocKy}>
                                    {item.tenHocKy} - {item.namHoc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={label}>So luong toi da</label>
                        <input
                            name="soLuongToiDa"
                            type="number"
                            value={form.soLuongToiDa}
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
                            <option value="DangMo">DangMo</option>
                            <option value="DaDong">DaDong</option>
                        </select>
                    </div>

                    <div>
                        <label style={label}>Thoi gian bat dau</label>
                        <input
                            name="thoiGianBatDau"
                            type="datetime-local"
                            value={form.thoiGianBatDau}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Thoi gian ket thuc</label>
                        <input
                            name="thoiGianKetThuc"
                            type="datetime-local"
                            value={form.thoiGianKetThuc}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>
                </div>

                <div style={buttonRow}>
                    <button type="submit" disabled={saving} style={primaryButton}>
                        {saving
                            ? 'Dang luu...'
                            : editingId !== null
                                ? 'Cap nhat lop hoc phan'
                                : 'Them lop hoc phan'}
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
                    <h2 style={cardTitle}>Danh sach lop hoc phan</h2>

                    <input
                        placeholder="Tim theo ten lop hoc phan, mon hoc, giang vien, hoc ky..."
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
                            So lop hoc phan: <strong>{filteredData.length}</strong>
                        </p>

                        <div style={tableWrapper}>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={th}>Ma LHP</th>
                                        <th style={th}>Ten Lop Hoc Phan</th>
                                        <th style={th}>Mon Hoc</th>
                                        <th style={th}>Giang Vien</th>
                                        <th style={th}>Hoc Ky</th>
                                        <th style={th}>So Luong</th>
                                        <th style={th}>Trang Thai</th>
                                        <th style={th}>Thao tac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} style={emptyCell}>
                                                Khong co du lieu phu hop
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.maLopHocPhan}>
                                                <td style={td}>{item.maLopHocPhan}</td>
                                                <td style={td}>{item.tenLopHocPhan}</td>
                                                <td style={td}>{item.tenMonHoc}</td>
                                                <td style={td}>{item.tenGiangVien}</td>
                                                <td style={td}>
                                                    {item.tenHocKy} {item.namHoc ? `- ${item.namHoc}` : ''}
                                                </td>
                                                <td style={td}>{item.soLuongToiDa}</td>
                                                <td style={td}>{item.trangThai}</td>
                                                <td style={td}>
                                                    <div style={actionRow}>
                                                        <button onClick={() => handleEdit(item)} style={editButton}>
                                                            Sua
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.maLopHocPhan)}
                                                            style={deleteButton}
                                                        >
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