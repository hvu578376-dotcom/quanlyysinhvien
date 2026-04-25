import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
    type CSSProperties,
} from 'react';

type MaKhoaItem = {
    maKhoa: number;
    tenKhoa: string;
    moTa: string | null;
};

type MaKhoaForm = {
    tenKhoa: string;
    moTa: string;
};

const API_URL = 'https://localhost:7242/api/MaKhoaApi';

const emptyForm: MaKhoaForm = {
    tenKhoa: '',
    moTa: '',
};

export function MaKhoa() {
    const [data, setData] = useState<MaKhoaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<MaKhoaForm>(emptyForm);

    useEffect(() => {
        loadData();
    }, []);

    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return data;

        return data.filter((item) => {
            return (
                String(item.maKhoa).toLowerCase().includes(keyword) ||
                (item.tenKhoa ?? '').toLowerCase().includes(keyword) ||
                (item.moTa ?? '').toLowerCase().includes(keyword)
            );
        });
    }, [data, searchTerm]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Khong lay duoc du lieu khoa');

            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error(err);
            setError('Khong ket noi duoc API MaKhoa');
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
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (item: MaKhoaItem) => {
        clearNotice();
        setEditingId(item.maKhoa);

        setForm({
            tenKhoa: item.tenKhoa ?? '',
            moTa: item.moTa ?? '',
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

        if (!form.tenKhoa.trim()) {
            showError('Ten khoa khong duoc de trong');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                tenKhoa: form.tenKhoa.trim(),
                moTa: form.moTa.trim() || null,
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
                throw new Error(isEdit ? 'Sua khoa that bai' : 'Them khoa that bai');
            }

            showSuccess(isEdit ? 'Sua khoa thanh cong' : 'Them khoa thanh cong');
            resetForm();
            await loadData();
        } catch (err) {
            console.error(err);
            showError(editingId !== null ? 'Sua khoa that bai' : 'Them khoa that bai');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Ban co chac muon xoa khoa nay khong?');
        if (!ok) return;

        clearNotice();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Xoa khoa that bai');
            }

            if (editingId === id) resetForm();

            showSuccess('Xoa khoa thanh cong');
            await loadData();
        } catch (err) {
            console.error(err);
            showError('Xoa khoa that bai');
        }
    };

    return (
        <div style={page}>
            <h1 style={pageTitle}>Quan Ly Khoa</h1>

            <form onSubmit={handleSubmit} style={card}>
                <div style={formHeaderRow}>
                    <h2 style={cardTitle}>
                        {editingId !== null ? 'Sua khoa' : 'Them khoa moi'}
                    </h2>

                    {editingId !== null && (
                        <span style={editBadge}>Dang sua Ma Khoa: {editingId}</span>
                    )}
                </div>

                <div style={gridOne}>
                    <div>
                        <label style={label}>Ten khoa</label>
                        <input
                            name="tenKhoa"
                            value={form.tenKhoa}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div>
                        <label style={label}>Mo ta</label>
                        <textarea
                            name="moTa"
                            value={form.moTa}
                            onChange={handleChange}
                            style={textarea}
                            rows={4}
                        />
                    </div>
                </div>

                <div style={buttonRow}>
                    <button type="submit" disabled={saving} style={primaryButton}>
                        {saving
                            ? 'Dang luu...'
                            : editingId !== null
                                ? 'Cap nhat khoa'
                                : 'Them khoa'}
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
                    <h2 style={cardTitle}>Danh sach khoa</h2>

                    <input
                        placeholder="Tim theo ma khoa, ten khoa, mo ta..."
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
                            So khoa: <strong>{filteredData.length}</strong>
                        </p>

                        <div style={tableWrapper}>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={th}>Ma Khoa</th>
                                        <th style={th}>Ten Khoa</th>
                                        <th style={th}>Mo ta</th>
                                        <th style={th}>Thao tac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={emptyCell}>
                                                Khong co du lieu phu hop
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.maKhoa}>
                                                <td style={td}>{item.maKhoa}</td>
                                                <td style={td}>{item.tenKhoa}</td>
                                                <td style={td}>{item.moTa}</td>
                                                <td style={td}>
                                                    <div style={actionRow}>
                                                        <button onClick={() => handleEdit(item)} style={editButton}>
                                                            Sua
                                                        </button>
                                                        <button onClick={() => handleDelete(item.maKhoa)} style={deleteButton}>
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

const gridOne: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr',
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