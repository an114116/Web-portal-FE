import { Button, Checkbox, TextInput, PasswordInput, Theme } from "@carbon/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import "./Login.css";

// Giả lập người dùng với mật khẩu đã mã hóa
const users = {
  admin: bcrypt.hashSync("admin", 10),
  user: bcrypt.hashSync("user", 10),
};

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // ✅ Khi vào trang login, xóa trạng thái đăng nhập cũ
    localStorage.removeItem("isLoggedIn");

    // ✅ Tự động điền username nếu đã lưu
    const savedUsername = localStorage.getItem("rememberUsername");
    if (savedUsername) {
      setCredentials((prev) => ({ ...prev, username: savedUsername }));
    }

    // ✅ Kiểm tra thời gian khóa tài khoản (nếu có)
    const lockedUntil = localStorage.getItem("lockedUntil");
    if (lockedUntil && Date.now() < parseInt(lockedUntil)) {
      setIsLocked(true);
      const remaining = parseInt(lockedUntil) - Date.now();
      const timeout = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
        localStorage.removeItem("lockedUntil");
      }, remaining);

      return () => clearTimeout(timeout);
    }
  }, []);

  const isInputValid = (username, password) => {
    const forbiddenPattern = /[<>{}[\];'"`\\]/;
    const maxLength = 32;

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return false;
    }

    if (username.length > maxLength || password.length > maxLength) {
      alert("Tên đăng nhập hoặc mật khẩu quá dài.");
      return false;
    }

    if (forbiddenPattern.test(username) || forbiddenPattern.test(password)) {
      alert("Tên đăng nhập hoặc mật khẩu chứa ký tự không hợp lệ.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    const { username, password } = credentials;

    if (isLocked) {
      alert("Tài khoản đang bị tạm khóa. Vui lòng thử lại sau.");
      return;
    }

    if (!isInputValid(username, password)) return;

    if (users[username]) {
      const isMatch = await bcrypt.compare(password, users[username]);

      if (isMatch) {
        const rememberMe = document.getElementById("remember-me").checked;
        if (rememberMe) {
          localStorage.setItem("rememberUsername", username);
        } else {
          localStorage.removeItem("rememberUsername");
        }

        // ✅ Thiết lập đăng nhập
        localStorage.setItem("isLoggedIn", "true");

        setLoginAttempts(0);
        localStorage.removeItem("lockedUntil");

        // ✅ Chuyển hướng với `replace` để ngăn quay lại bằng nút Back
        navigate(username === "admin" ? "/admin/dashboard" : "/user/home", { replace: true });
        return;
      }
    }

    // ❌ Sai mật khẩu
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= 5) {
      const lockUntil = Date.now() + 30000;
      localStorage.setItem("lockedUntil", lockUntil.toString());
      setIsLocked(true);

      setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
        localStorage.removeItem("lockedUntil");
      }, 30000);

      alert("Bạn đã nhập sai quá nhiều lần. Tài khoản bị khóa trong 30 giây.");
    } else {
      alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  return (
    <Theme theme="g10">
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <div className="form-content">
            <div className="input-field">
              <TextInput
                id="username"
                labelText="Username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </div>

            <div className="input-field">
              <PasswordInput
                id="password"
                labelText="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                showPasswordLabel=""
                hidePasswordLabel=""
              />
            </div>

            <div className="remember-me">
              <Checkbox id="remember-me" labelText="Remember me" />
            </div>

            <Button
              className="login-button"
              kind="primary"
              size="lg"
              onClick={handleLogin}
              disabled={isLocked}
            >
              LOGIN →
            </Button>
          </div>
        </div>
      </div>
    </Theme>
  );
}

export default Login;