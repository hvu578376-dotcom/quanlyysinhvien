import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type CSSProperties,
} from 'react';

type KetQuaHocTapItem = {
    maKetQua: number;
    maTaiKhoan: number;
    tenSinhVien: string | null;
    maLopHocPhan: number;
    tenLopHocPhan: string | null;
    diemChuyenCan: number | null;
    diemGiuaKy: number | null;
    diemCuoiKy: number | null;
    diemQuaTrinh: number | null;
    diemKetThucHocPhan: number | null;
    diemTongKet: number | null;
    ketQua: string | null;
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

type KetQuaHocTapForm = {
    maTaiKhoan: string;
    maLopHocPhan: string;
    diemChuyenCan: string;
    diemGiuaKy: string;
    diemCuoiKy: string;
    diemQuaTrinh: string;
    diemKetThucHocPhan: string;
};

const API_URL = 'https://localhost:7242/api/KetQuaHocTapApi';
const TAIKHOAN_API_URL = 'https://localhost:7242/api/TaiKhoanApi';
const LOPHOCPHAN_API_URL = 'https://localhost:7242/api/LopHocPhanApi';

const emptyForm: KetQuaHocTapForm = {
    maTaiKhoan: '',
    maLopHocPhan: '',
    diemChuyenCan: '',
    diemGiuaKy: '',
    diemCuoiKy: '',
    diemQuaTrinh: '',
    diemKetThucHocPhan: '',
};

export function KetQuaHocTap() {
    const [data, setData] = useState<KetQuaHocTapItem[]>([]);
    const [sinhVienOptions, setSinhVienOptions] = useState<TaiKhoanOption[]>([]);
    const [lopHocPhanOptions, setLopHocPhanOptions] = useState<LopHocPhanOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<KetQuaHocTapForm>(emptyForm);

    useEffect(() => {
        loadAll();
    }, []);

    const parseDecimal = (value: string) => {
        return value.trim() === '' ? null : Number(value);
    };

    const round2 = (num: number) => Math.round(num * 100) / 100;

    const scoreFields = useMemo(() => {
        return [
            parseDecimal(form.diemChuyenCan),
            parseDecimal(form.diemGiuaKy),
            parseDecimal(form.diemCuoiKy),
            parseDecimal(form.diemQuaTrinh),
            parseDecimal(form.diemKetThucHocPhan),
        ].filter((x): x is number => x !== null && !Number.isNaN(x));
    }, [
        form.diemChuyenCan,
        form.diemGiuaKy,
        form.diemCuoiKy,
        form.diemQuaTrinh,
        form.diemKetThucHocPhan,
    ]);

    const diemTongKetAuto = useMemo(() => {
        if (scoreFields.length === 0) return '';
        const avg =
            scoreFields.reduce((sum, current) => sum + current, 0) / scoreFields.length;
        return round2(avg).toString();
    }, [scoreFields]);

    const ketQuaAuto = useMemo(() => {
        if (diemTongKetAuto === '') return '';
        const diem = Number(diemTongKetAuto);
        return diem >= 5 ? 'Dat' : 'Khong Dat';
    }, [diemTongKetAuto]);

    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return data;

        return data.filter((item) => {
            return (
                String(item.maKetQua).toLowerCase().includes(keyword) ||
                (item.tenSinhVien ?? '').toLowerCase().includes(keyword) ||
                (item.tenLopHocPhan ?? '').toLowerCase().includes(keyword) ||
                (item.ketQua ?? '').toLowerCase().includes(keyword)
            );
        });
    }, [data, searchTerm]);

    const loadAll = async () => {
        try {
            setLoading(true);
            setError('');

            const [ketQuaRes, taiKhoanRes, lopHocPhanRes] = await Promise.all([
                fetch(API_URL),
                fetch(TAIKHOAN_API_URL),
                fetch(LOPHOCPHAN_API_URL),
            ]);

            if (!ketQuaRes.ok) throw new Error('Khong lay duoc du lieu ket qua hoc tap');
            if (!taiKhoanRes.ok) throw new Error('Khong lay duoc du lieu tai khoan');
            if (!lopHocPhanRes.ok) throw new Error('Khong lay duoc du lieu lop hoc phan');

            const ketQuaData = await ketQuaRes.json();
            const taiKhoanData = await taiKhoanRes.json();
            const lopHocPhanData = await lopHocPhanRes.json();

            const sinhViens = taiKhoanData.filter(
                (x: TaiKhoanOption) => (x.vaiTro ?? '').toLowerCase().includes('sinh')
            );

            setData(ketQuaData);
            setSinhVienOptions(sinhViens.length > 0 ? sinhViens : taiKhoanData);
            setLopHocPhanOptions(lopHocPhanData);
        } catch (err) {
            console.error(err);
            setError('Khong ket noi duoc API KetQuaHocTap');
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

    const validateScoreValue = (value: string) => {
        if (value.trim() === '') return true;

        const num = Number(value);
        if (Number.isNaN(num)) return false;
        return num >= 0 && num <= 10;
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        const diemFields = [
            'diemChuyenCan',
            'diemGiuaKy',
            'diemCuoiKy',
            'diemQuaTrinh',
            'diemKetThucHocPhan',
        ];

        if (diemFields.includes(name)) {
            if (value !== '' && !/^(\d+([.]\d{0,2})?)?$/.test(value)) {
                return;
            }
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (item: KetQuaHocTapItem) => {
        clearNotice();
        setEditingId(item.maKetQua);

        setForm({
            maTaiKhoan: String(item.maTaiKhoan),
            maLopHocPhan: String(item.maLopHocPhan),
            diemChuyenCan: item.diemChuyenCan?.toString() ?? '',
            diemGiuaKy: item.diemGiuaKy?.toString() ?? '',
            diemCuoiKy: item.diemCuoiKy?.toString() ?? '',
            diemQuaTrinh: item.diemQuaTrinh?.toString() ?? '',
            diemKetThucHocPhan: item.diemKetThucHocPhan?.toString() ?? '',
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

        if (!form.maTaiKhoan) {
            showError('Ban phai chon sinh vien');
            return;
        }

        if (!form.maLopHocPhan) {
            showError('Ban phai chon lop hoc phan');
            return;
        }

        const diemInputs = [
            form.diemChuyenCan,
            form.diemGiuaKy,
            form.diemCuoiKy,
            form.diemQuaTrinh,
            form.diemKetThucHocPhan,
        ];

        for (const diem of diemInputs) {
            if (!validateScoreValue(diem)) {
                showError('Tat ca diem phai nam trong khoang tu 0 den 10');
                return;
            }
        }

        try {
            setSaving(true);

            const payload = {
                maTaiKhoan: Number(form.maTaiKhoan),
                maLopHocPhan: Number(form.maLopHocPhan),
                diemChuyenCan: parseDecimal(form.diemChuyenCan),
                diemGiuaKy: parseDecimal(form.diemGiuaKy),
                diemCuoiKy: parseDecimal(form.diemCuoiKy),
                diemQuaTrinh: parseDecimal(form.diemQuaTrinh),
                diemKetThucHocPhan: parseDecimal(form.diemKetThucHocPhan),
                diemTongKet: diemTongKetAuto === '' ? null : Number(diemTongKetAuto),
                ketQua: ketQuaAuto || null,
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
                    isEdit ? 'Sua ket qua hoc tap that bai' : 'Them ket qua hoc tap that bai'
                );
            }

            showSuccess(
                isEdit
                    ? 'Sua ket qua hoc tap thanh cong'
                    : 'Them ket qua hoc tap thanh cong'
            );
            resetForm();
            await loadAll();
        } catch (err) {
            console.error(err);
            showError(
                editingId !== null
                    ? 'Sua ket qua hoc tap that bai'
                    : 'Them ket qua hoc tap that bai'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Ban co chac muon xoa ket qua hoc tap nay khong?');
        if (!ok) return;

        clearNotice();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Xoa ket qua hoc tap that bai');
            }

            if (editingId === id) resetForm();

            showSuccess('Xoa ket qua hoc tap thanh cong');
            await loadAll();
        } catch (err) {
            console.error(err);
            showError('Xoa ket qua hoc tap that bai');
        }
    };

    return (
        <div style={page}>
            <h1 style={pageTitle}>Quan Ly Ket Qua Hoc Tap</h1>

            <form onSubmit={handleSubmit} style={card}>
                <div style={formHeaderRow}>
                    <h2 style={cardTitle}>
                        {editingId !== null ? 'Sua ket qua hoc tap' : 'Them ket qua hoc tap moi'}
                    </h2>

                    {editingId !== null && (
                        <span style={editBadge}>Dang sua Ma Ket Qua: {editingId}</span>
                    )}
                </div>

                <div style={grid}>
                    <div>
                        <label style={label}>Sinh vien</label>
                        <select
                            name="maTaiKhoan"
                            value={form.maTaiKhoan}
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
                        <label style={label}>Diem chuyen can</label>
                        <input
                            name="diemChuyenCan"
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={form.diemChuyenCan}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Diem giua ky</label>
                        <input
                            name="diemGiuaKy"
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={form.diemGiuaKy}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Diem cuoi ky</label>
                        <input
                            name="diemCuoiKy"
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={form.diemCuoiKy}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Diem qua trinh</label>
                        <input
                            name="diemQuaTrinh"
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={form.diemQuaTrinh}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Diem ket thuc hoc phan</label>
                        <input
                            name="diemKetThucHocPhan"
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={form.diemKetThucHocPhan}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Diem tong ket</label>
                        <input value={diemTongKetAuto} readOnly style={readOnlyInput} />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={label}>Ket qua</label>
                        <input value={ketQuaAuto} readOnly style={readOnlyInput} />
                    </div>
                </div>

                <div style={noteBox}>
                    Diem tong ket dang duoc tinh tu dong theo trung binh cac cot diem da nhap
                    va ket qua se la Dat khi diem tong ket tu 5 tro len
                </div>

                <div style={buttonRow}>
                    <button type="submit" disabled={saving} style={primaryButton}>
                        {saving
                            ? 'Dang luu...'
                            : editingId !== null
                                ? 'Cap nhat ket qua hoc tap'
                                : 'Them ket qua hoc tap'}
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
                    <h2 style={cardTitle}>Danh sach ket qua hoc tap</h2>

                    <input
                        placeholder="Tim theo sinh vien, lop hoc phan, ket qua..."
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
                            So ket qua: <strong>{filteredData.length}</strong>
                        </p>

                        <div style={tableWrapper}>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={th}>Ma KQ</th>
                                        <th style={th}>Sinh Vien</th>
                                        <th style={th}>Lop Hoc Phan</th>
                                        <th style={th}>CC</th>
                                        <th style={th}>GK</th>
                                        <th style={th}>CK</th>
                                        <th style={th}>Tong Ket</th>
                                        <th style={th}>Ket Qua</th>
                                        <th style={th}>Thao tac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} style={emptyCell}>
                                                Khong co du lieu phu hop
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.maKetQua}>
                                                <td style={td}>{item.maKetQua}</td>
                                                <td style={td}>{item.tenSinhVien}</td>
                                                <td style={td}>{item.tenLopHocPhan}</td>
                                                <td style={td}>{item.diemChuyenCan}</td>
                                                <td style={td}>{item.diemGiuaKy}</td>
                                                <td style={td}>{item.diemCuoiKy}</td>
                                                <td style={td}>{item.diemTongKet}</td>
                                                <td style={td}>{item.ketQua}</td>
                                                <td style={td}>
                                                    <div style={actionRow}>
                                                        <button onClick={() => handleEdit(item)} style={editButton}>
                                                            Sua
                                                        </button>
                                                        <button onClick={() => handleDelete(item.maKetQua)} style={deleteButton}>
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

const readOnlyInput: CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cfd8dc',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#f3f4f6',
    color: '#111827',
    fontWeight: 700,
};

const noteBox: CSSProperties = {
    marginTop: '14px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    fontWeight: 600,
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