import { Button, Checkbox, TextInput, PasswordInput, Theme } from "@carbon/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const users = {
    admin: "admin", 
    user: "user",
  };

  const handleLogin = () => {
    const { username, password } = credentials;

    if (users[username] && users[username] === password) {
      if (username === "admin") {
        navigate("/admin/dashboard");
      } else if (username === "user") {
        navigate("/user/home");
      }
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
            {/* Username */}
            <div className="input-field">
              <TextInput
                id="username"
                labelText="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="input-field">
              <PasswordInput
                id="password"
                labelText="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                showPasswordLabel=""
                hidePasswordLabel=""
              />
            </div>

            {/* Remember Me */}
            <div className="remember-me">
              <Checkbox id="remember-me" labelText="Remember me" />
            </div>

            {/* Login Button */}
            <Button className="login-button" kind="primary" size="lg" onClick={handleLogin}>
              LOGIN →
            </Button>
          </div>
        </div>
      </div>
    </Theme>
  );
}

export default Login;
