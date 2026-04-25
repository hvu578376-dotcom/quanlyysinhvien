import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type CSSProperties,
} from 'react';

type TaiKhoanItem = {
    maTaiKhoan: number;
    tenDangNhap: string;
    matKhau: string;
    vaiTro: string;
    trangThai: boolean;
    email: string;
    hoTen: string;
    soDienThoai: string;
    ngaySinh: string | null;
    gioiTinh: boolean | null;
    diaChi: string;
    maLop: number | null;
    chuyenNganh: string;
    hocVi: string;
};

type TaiKhoanForm = {
    tenDangNhap: string;
    matKhau: string;
    vaiTro: string;
    trangThai: boolean;
    email: string;
    hoTen: string;
    soDienThoai: string;
    ngaySinh: string;
    gioiTinh: string;
    diaChi: string;
    maLop: string;
    chuyenNganh: string;
    hocVi: string;
};

const API_URL = 'https://localhost:7242/api/TaiKhoanApi';

const emptyForm: TaiKhoanForm = {
    tenDangNhap: '',
    matKhau: '',
    vaiTro: 'Sinh vien',
    trangThai: true,
    email: '',
    hoTen: '',
    soDienThoai: '',
    ngaySinh: '',
    gioiTinh: '',
    diaChi: '',
    maLop: '',
    chuyenNganh: '',
    hocVi: '',
};

function toDateInputValue(value: string | null) {
    if (!value) return '';
    return value.slice(0, 10);
}

function mapGioiTinhLabel(value: boolean | null) {
    if (value === true) return 'Nam';
    if (value === false) return 'Nu';
    return '';
}

function mapTrangThaiLabel(value: boolean) {
    return value ? 'Hoat dong' : 'Khoa';
}

export function TaiKhoan() {
    const [data, setData] = useState<TaiKhoanItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<TaiKhoanForm>(emptyForm);

    useEffect(() => {
        loadData();
    }, []);

    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return data;

        return data.filter((item) => {
            return (
                String(item.maTaiKhoan).toLowerCase().includes(keyword) ||
                (item.tenDangNhap ?? '').toLowerCase().includes(keyword) ||
                (item.hoTen ?? '').toLowerCase().includes(keyword) ||
                (item.email ?? '').toLowerCase().includes(keyword) ||
                (item.vaiTro ?? '').toLowerCase().includes(keyword) ||
                (item.soDienThoai ?? '').toLowerCase().includes(keyword) ||
                (item.chuyenNganh ?? '').toLowerCase().includes(keyword) ||
                (item.hocVi ?? '').toLowerCase().includes(keyword) ||
                (item.diaChi ?? '').toLowerCase().includes(keyword)
            );
        });
    }, [data, searchTerm]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Khong lay duoc du lieu tai khoan');

            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error(err);
            setError('Khong ket noi duoc API TaiKhoan');
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
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'trangThai') {
            setForm((prev) => ({
                ...prev,
                trangThai: value === 'true',
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (item: TaiKhoanItem) => {
        clearNotice();
        setEditingId(item.maTaiKhoan);

        setForm({
            tenDangNhap: item.tenDangNhap ?? '',
            matKhau: item.matKhau ?? '',
            vaiTro: item.vaiTro ?? 'Sinh vien',
            trangThai: item.trangThai,
            email: item.email ?? '',
            hoTen: item.hoTen ?? '',
            soDienThoai: item.soDienThoai ?? '',
            ngaySinh: toDateInputValue(item.ngaySinh),
            gioiTinh:
                item.gioiTinh === null
                    ? ''
                    : item.gioiTinh === true
                        ? 'true'
                        : 'false',
            diaChi: item.diaChi ?? '',
            maLop: item.maLop?.toString() ?? '',
            chuyenNganh: item.chuyenNganh ?? '',
            hocVi: item.hocVi ?? '',
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

        if (!form.tenDangNhap.trim()) {
            showError('Ten dang nhap khong duoc de trong');
            return;
        }

        if (!form.matKhau.trim()) {
            showError('Mat khau khong duoc de trong');
            return;
        }

        if (!form.hoTen.trim()) {
            showError('Ho ten khong duoc de trong');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                tenDangNhap: form.tenDangNhap.trim(),
                matKhau: form.matKhau.trim(),
                vaiTro: form.vaiTro.trim(),
                trangThai: form.trangThai,
                email: form.email.trim(),
                hoTen: form.hoTen.trim(),
                soDienThoai: form.soDienThoai.trim(),
                ngaySinh: form.ngaySinh || null,
                gioiTinh:
                    form.gioiTinh === ''
                        ? null
                        : form.gioiTinh === 'true',
                diaChi: form.diaChi.trim(),
                maLop: form.maLop.trim() === '' ? null : Number(form.maLop),
                chuyenNganh: form.chuyenNganh.trim(),
                hocVi: form.hocVi.trim(),
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
                    isEdit ? 'Sua tai khoan that bai' : 'Them tai khoan that bai'
                );
            }

            showSuccess(
                isEdit ? 'Sua tai khoan thanh cong' : 'Them tai khoan thanh cong'
            );
            resetForm();
            await loadData();
        } catch (err) {
            console.error(err);
            showError(
                editingId !== null
                    ? 'Sua tai khoan that bai'
                    : 'Them tai khoan that bai'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Ban co chac muon xoa tai khoan nay khong?');
        if (!ok) return;

        clearNotice();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Xoa tai khoan that bai');
            }

            if (editingId === id) resetForm();

            showSuccess('Xoa tai khoan thanh cong');
            await loadData();
        } catch (err) {
            console.error(err);
            showError('Xoa tai khoan that bai');
        }
    };

    return (
        <div style={page}>
            <h1 style={pageTitle}>Quan Ly Tai Khoan</h1>

            <form onSubmit={handleSubmit} style={card}>
                <div style={formHeaderRow}>
                    <h2 style={cardTitle}>
                        {editingId !== null ? 'Sua tai khoan' : 'Them tai khoan moi'}
                    </h2>

                    {editingId !== null && (
                        <span style={editBadge}>Dang sua Ma TK: {editingId}</span>
                    )}
                </div>

                <div style={grid}>
                    <div>
                        <label style={label}>Ten dang nhap</label>
                        <input
                            name="tenDangNhap"
                            value={form.tenDangNhap}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Mat khau</label>
                        <input
                            name="matKhau"
                            value={form.matKhau}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Ho ten</label>
                        <input
                            name="hoTen"
                            value={form.hoTen}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>So dien thoai</label>
                        <input
                            name="soDienThoai"
                            value={form.soDienThoai}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Ngay sinh</label>
                        <input
                            name="ngaySinh"
                            type="date"
                            value={form.ngaySinh}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Gioi tinh</label>
                        <select
                            name="gioiTinh"
                            value={form.gioiTinh}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="">-- Chon --</option>
                            <option value="true">Nam</option>
                            <option value="false">Nu</option>
                        </select>
                    </div>

                    <div>
                        <label style={label}>Vai tro</label>
                        <select
                            name="vaiTro"
                            value={form.vaiTro}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="Sinh vien">Sinh vien</option>
                            <option value="Giang vien">Giang vien</option>
                            <option value="Quan tri vien">Quan tri vien</option>
                        </select>
                    </div>

                    <div>
                        <label style={label}>Trang thai</label>
                        <select
                            name="trangThai"
                            value={String(form.trangThai)}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="true">Hoat dong</option>
                            <option value="false">Khoa</option>
                        </select>
                    </div>

                    <div>
                        <label style={label}>Ma lop</label>
                        <input
                            name="maLop"
                            type="number"
                            value={form.maLop}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Chuyen nganh</label>
                        <input
                            name="chuyenNganh"
                            value={form.chuyenNganh}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Hoc vi</label>
                        <input
                            name="hocVi"
                            value={form.hocVi}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={label}>Dia chi</label>
                        <textarea
                            name="diaChi"
                            value={form.diaChi}
                            onChange={handleChange}
                            style={textarea}
                            rows={3}
                        />
                    </div>
                </div>

                <div style={buttonRow}>
                    <button type="submit" disabled={saving} style={primaryButton}>
                        {saving
                            ? 'Dang luu...'
                            : editingId !== null
                                ? 'Cap nhat tai khoan'
                                : 'Them tai khoan'}
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
                    <h2 style={cardTitle}>Danh sach tai khoan</h2>

                    <input
                        placeholder="Tim theo ma, ten dang nhap, ho ten, email..."
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
                            So tai khoan: <strong>{filteredData.length}</strong>
                        </p>

                        <div style={tableWrapper}>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={th}>Ma TK</th>
                                        <th style={th}>Ten dang nhap</th>
                                        <th style={th}>Mat khau</th>
                                        <th style={th}>Ho ten</th>
                                        <th style={th}>Email</th>
                                        <th style={th}>So dien thoai</th>
                                        <th style={th}>Ngay sinh</th>
                                        <th style={th}>Gioi tinh</th>
                                        <th style={th}>Vai tro</th>
                                        <th style={th}>Trang thai</th>
                                        <th style={th}>Ma lop</th>
                                        <th style={th}>Chuyen nganh</th>
                                        <th style={th}>Hoc vi</th>
                                        <th style={th}>Dia chi</th>
                                        <th style={th}>Thao tac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={15} style={emptyCell}>
                                                Khong co du lieu phu hop
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.maTaiKhoan}>
                                                <td style={td}>{item.maTaiKhoan}</td>
                                                <td style={td}>{item.tenDangNhap}</td>
                                                <td style={td}>{item.matKhau}</td>
                                                <td style={td}>{item.hoTen}</td>
                                                <td style={td}>{item.email}</td>
                                                <td style={td}>{item.soDienThoai}</td>
                                                <td style={td}>{item.ngaySinh ? item.ngaySinh.slice(0, 10) : ''}</td>
                                                <td style={td}>{mapGioiTinhLabel(item.gioiTinh)}</td>
                                                <td style={td}>{item.vaiTro}</td>
                                                <td style={td}>
                                                    <span style={item.trangThai ? activeBadge : lockedBadge}>
                                                        {mapTrangThaiLabel(item.trangThai)}
                                                    </span>
                                                </td>
                                                <td style={td}>{item.maLop ?? ''}</td>
                                                <td style={td}>{item.chuyenNganh}</td>
                                                <td style={td}>{item.hocVi}</td>
                                                <td style={td}>{item.diaChi}</td>
                                                <td style={td}>
                                                    <div style={actionRow}>
                                                        <button onClick={() => handleEdit(item)} style={editButton}>
                                                            Sua
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.maTaiKhoan)}
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

const textarea: CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cfd8dc',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'Arial, sans-serif',
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
    whiteSpace: 'nowrap',
};

const td: CSSProperties = {
    border: '1px solid #d6dbe1',
    padding: '10px',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
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

const activeBadge: CSSProperties = {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: '999px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontWeight: 700,
};

const lockedBadge: CSSProperties = {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: '999px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    fontWeight: 700,
};