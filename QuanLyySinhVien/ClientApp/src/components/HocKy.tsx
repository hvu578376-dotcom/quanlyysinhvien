import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type CSSProperties,
} from 'react';

type HocKyItem = {
    maHocKy: number;
    tenHocKy: string;
    namHoc: string;
    trangThai: boolean;
};

type HocKyForm = {
    tenHocKy: string;
    namHoc: string;
    trangThai: boolean;
};

const API_URL = 'https://localhost:7242/api/HocKyApi';

const emptyForm: HocKyForm = {
    tenHocKy: '',
    namHoc: '',
    trangThai: true,
};

export function HocKy() {
    const [data, setData] = useState<HocKyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<HocKyForm>(emptyForm);

    useEffect(() => {
        loadData();
    }, []);

    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        if (!keyword) return data;

        return data.filter((item) => {
            return (
                String(item.maHocKy).toLowerCase().includes(keyword) ||
                (item.tenHocKy ?? '').toLowerCase().includes(keyword) ||
                (item.namHoc ?? '').toLowerCase().includes(keyword)
            );
        });
    }, [data, searchTerm]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await fetch(API_URL);
            if (!res.ok) {
                throw new Error('Khong lay duoc du lieu hoc ky');
            }

            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error(err);
            setError('Khong ket noi duoc API HocKy');
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

    const handleEdit = (item: HocKyItem) => {
        clearNotice();
        setEditingId(item.maHocKy);

        setForm({
            tenHocKy: item.tenHocKy ?? '',
            namHoc: item.namHoc ?? '',
            trangThai: item.trangThai,
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

        if (!form.tenHocKy.trim()) {
            showError('Ten hoc ky khong duoc de trong');
            return;
        }

        if (!form.namHoc.trim()) {
            showError('Nam hoc khong duoc de trong');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                tenHocKy: form.tenHocKy.trim(),
                namHoc: form.namHoc.trim(),
                trangThai: form.trangThai,
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
                throw new Error(isEdit ? 'Sua hoc ky that bai' : 'Them hoc ky that bai');
            }

            showSuccess(isEdit ? 'Sua hoc ky thanh cong' : 'Them hoc ky thanh cong');
            resetForm();
            await loadData();
        } catch (err) {
            console.error(err);
            showError(editingId !== null ? 'Sua hoc ky that bai' : 'Them hoc ky that bai');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Ban co chac muon xoa hoc ky nay khong?');
        if (!ok) return;

        clearNotice();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Xoa hoc ky that bai');
            }

            if (editingId === id) {
                resetForm();
            }

            showSuccess('Xoa hoc ky thanh cong');
            await loadData();
        } catch (err) {
            console.error(err);
            showError('Xoa hoc ky that bai');
        }
    };

    return (
        <div style={page}>
            <h1 style={pageTitle}>Quan Ly Hoc Ky</h1>

            <form onSubmit={handleSubmit} style={card}>
                <div style={formHeaderRow}>
                    <h2 style={cardTitle}>
                        {editingId !== null ? 'Sua hoc ky' : 'Them hoc ky moi'}
                    </h2>

                    {editingId !== null && (
                        <span style={editBadge}>Dang sua Ma Hoc Ky: {editingId}</span>
                    )}
                </div>

                <div style={grid}>
                    <div>
                        <label style={label}>Ten hoc ky</label>
                        <input
                            name="tenHocKy"
                            value={form.tenHocKy}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Nam hoc</label>
                        <input
                            name="namHoc"
                            value={form.namHoc}
                            onChange={handleChange}
                            style={input}
                        />
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
                            <option value="false">Khong hoat dong</option>
                        </select>
                    </div>
                </div>

                <div style={buttonRow}>
                    <button type="submit" disabled={saving} style={primaryButton}>
                        {saving
                            ? 'Dang luu...'
                            : editingId !== null
                                ? 'Cap nhat hoc ky'
                                : 'Them hoc ky'}
                    </button>

                    {editingId !== null && (
                        <button type="button" onClick={handleCancelEdit} style={secondaryButton}>
                            Huy sua
                        </button>
                    )}
                </div>

                {message && (
                    <div
                        style={
                            messageType === 'success' ? successMessageBox : errorMessageBox
                        }
                    >
                        {message}
                    </div>
                )}
            </form>

            <div style={card}>
                <div style={topBar}>
                    <h2 style={cardTitle}>Danh sach hoc ky</h2>

                    <input
                        placeholder="Tim theo ma hoc ky, ten hoc ky, nam hoc..."
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
                            So hoc ky: <strong>{filteredData.length}</strong>
                        </p>

                        <div style={tableWrapper}>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={th}>Ma Hoc Ky</th>
                                        <th style={th}>Ten Hoc Ky</th>
                                        <th style={th}>Nam Hoc</th>
                                        <th style={th}>Trang Thai</th>
                                        <th style={th}>Thao tac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={emptyCell}>
                                                Khong co du lieu phu hop
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.maHocKy}>
                                                <td style={td}>{item.maHocKy}</td>
                                                <td style={td}>{item.tenHocKy}</td>
                                                <td style={td}>{item.namHoc}</td>
                                                <td style={td}>
                                                    <span
                                                        style={
                                                            item.trangThai ? activeBadge : lockedBadge
                                                        }
                                                    >
                                                        {item.trangThai ? 'Hoat dong' : 'Khong hoat dong'}
                                                    </span>
                                                </td>
                                                <td style={td}>
                                                    <div style={actionRow}>
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            style={editButton}
                                                        >
                                                            Sua
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(item.maHocKy)}
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