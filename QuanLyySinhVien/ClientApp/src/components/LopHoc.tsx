import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type CSSProperties,
} from 'react';

type LopHocItem = {
    maLop: number;
    tenLop: string;
    khoa: string | null;
    nienKhoa: string | null;
    maNganh: number | null;
};

type LopHocForm = {
    tenLop: string;
    khoa: string;
    nienKhoa: string;
    maNganh: string;
};

const API_URL = 'https://localhost:7242/api/LopHocApi';

const emptyForm: LopHocForm = {
    tenLop: '',
    khoa: '',
    nienKhoa: '',
    maNganh: '',
};

export function LopHoc() {
    const [data, setData] = useState<LopHocItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<LopHocForm>(emptyForm);

    useEffect(() => {
        loadData();
    }, []);

    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        if (!keyword) return data;

        return data.filter((item) => {
            return (
                String(item.maLop).toLowerCase().includes(keyword) ||
                (item.tenLop ?? '').toLowerCase().includes(keyword) ||
                (item.khoa ?? '').toLowerCase().includes(keyword) ||
                (item.nienKhoa ?? '').toLowerCase().includes(keyword) ||
                String(item.maNganh ?? '').toLowerCase().includes(keyword)
            );
        });
    }, [data, searchTerm]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await fetch(API_URL);
            if (!res.ok) {
                throw new Error('Khong lay duoc du lieu lop hoc');
            }

            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error(err);
            setError('Khong ket noi duoc API LopHoc');
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (item: LopHocItem) => {
        clearNotice();
        setEditingId(item.maLop);

        setForm({
            tenLop: item.tenLop ?? '',
            khoa: item.khoa ?? '',
            nienKhoa: item.nienKhoa ?? '',
            maNganh: item.maNganh === null ? '' : String(item.maNganh),
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

        if (!form.tenLop.trim()) {
            showError('Ten lop khong duoc de trong');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                tenLop: form.tenLop.trim(),
                khoa: form.khoa.trim() || null,
                nienKhoa: form.nienKhoa.trim() || null,
                maNganh: form.maNganh === '' ? null : Number(form.maNganh),
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
                throw new Error(isEdit ? 'Sua lop hoc that bai' : 'Them lop hoc that bai');
            }

            showSuccess(isEdit ? 'Sua lop hoc thanh cong' : 'Them lop hoc thanh cong');
            resetForm();
            await loadData();
        } catch (err) {
            console.error(err);
            showError(editingId !== null ? 'Sua lop hoc that bai' : 'Them lop hoc that bai');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Ban co chac muon xoa lop hoc nay khong?');
        if (!ok) return;

        clearNotice();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Xoa lop hoc that bai');
            }

            if (editingId === id) {
                resetForm();
            }

            showSuccess('Xoa lop hoc thanh cong');
            await loadData();
        } catch (err) {
            console.error(err);
            showError('Xoa lop hoc that bai');
        }
    };

    return (
        <div style={page}>
            <h1 style={pageTitle}>Quan Ly Lop Hoc</h1>

            <form onSubmit={handleSubmit} style={card}>
                <div style={formHeaderRow}>
                    <h2 style={cardTitle}>
                        {editingId !== null ? 'Sua lop hoc' : 'Them lop hoc moi'}
                    </h2>

                    {editingId !== null && (
                        <span style={editBadge}>Dang sua Ma Lop: {editingId}</span>
                    )}
                </div>

                <div style={grid}>
                    <div>
                        <label style={label}>Ten lop</label>
                        <input
                            name="tenLop"
                            value={form.tenLop}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Khoa</label>
                        <input
                            name="khoa"
                            value={form.khoa}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Nien khoa</label>
                        <input
                            name="nienKhoa"
                            value={form.nienKhoa}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Ma nganh</label>
                        <input
                            name="maNganh"
                            type="number"
                            value={form.maNganh}
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
                                ? 'Cap nhat lop hoc'
                                : 'Them lop hoc'}
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
                    <h2 style={cardTitle}>Danh sach lop hoc</h2>

                    <input
                        placeholder="Tim theo ma lop, ten lop, khoa, nien khoa..."
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
                            So lop hoc: <strong>{filteredData.length}</strong>
                        </p>

                        <div style={tableWrapper}>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={th}>Ma Lop</th>
                                        <th style={th}>Ten Lop</th>
                                        <th style={th}>Khoa</th>
                                        <th style={th}>Nien khoa</th>
                                        <th style={th}>Ma Nganh</th>
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
                                            <tr key={item.maLop}>
                                                <td style={td}>{item.maLop}</td>
                                                <td style={td}>{item.tenLop}</td>
                                                <td style={td}>{item.khoa}</td>
                                                <td style={td}>{item.nienKhoa}</td>
                                                <td style={td}>{item.maNganh}</td>
                                                <td style={td}>
                                                    <div style={actionRow}>
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            style={editButton}
                                                        >
                                                            Sua
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(item.maLop)}
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