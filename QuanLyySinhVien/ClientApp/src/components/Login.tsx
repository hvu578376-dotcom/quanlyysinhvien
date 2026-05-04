import { useState, type CSSProperties } from "react";

type Props = {
    onSuccess: () => void;
};

type LoginResponse = {
    maTaiKhoan: number;
    tenDangNhap: string;
    vaiTro: string;
    trangThai: string;
    email?: string;
    hoTen?: string;
};

export default function Login({ onSuccess }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleLogin = async () => {
        if (!username.trim() || !password) {
            alert("Vui lòng nhập đủ tên đăng nhập và mật khẩu!");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/TaiKhoanApi/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tenDangNhap: username,
                    matKhau: password,
                }),
            });

            if (res.status === 401) {
                alert("Sai tên đăng nhập hoặc mật khẩu!");
                return;
            }

            if (res.status === 403) {
                alert("Tài khoản đang bị khóa / không hoạt động!");
                return;
            }

            if (!res.ok) {
                const txt = await res.text();
                alert("Lỗi đăng nhập: " + txt);
                return;
            }

            const data: LoginResponse = await res.json();

            // Lưu trạng thái đăng nhập
            localStorage.setItem("auth", "true");
            localStorage.setItem("user", JSON.stringify(data));

            onSuccess();
        } catch (e: any) {
            alert("Không kết nối được server: " + (e?.message ?? "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div style={wrap}>
            <div style={card}>
                <h2 style={title}>Sign In</h2>

                <input
                    style={input}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoFocus
                />

                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        style={{ ...input, paddingRight: 44 }}
                        placeholder="Password"
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={onKeyDown}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        style={eyeBtn}
                        title="Show/Hide"
                    >
                        {showPass ? "🙈" : "👁️"}
                    </button>
                </div>

                <button style={loginBtn} onClick={handleLogin} disabled={loading}>
                    {loading ? "Dang dang nhap..." : "Login"}
                </button>
            </div>
        </div>
    );
}

const wrap: CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
    padding: 16,
};

const card: CSSProperties = {
    width: 320,
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    textAlign: "center",
};

const title: CSSProperties = {
    margin: "0 0 16px 0",
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
};

const input: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: 12,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #dbe3ee",
    outline: "none",
    fontSize: 14,
};

const loginBtn: CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: "#1976d2",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: 4,
    opacity: 1,
};

const eyeBtn: CSSProperties = {
    position: "absolute",
    right: 8,
    top: 6,
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
};