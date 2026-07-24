import React, { useState } from "react";
import axios from "axios";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCapsules
} from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {

  if(username === "" || password === "") {

    alert("Please enter Username and Password");
    return;
  }

  try {

    const response =
      await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password
        }
      );

    if(response.data){

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      alert("Login Successful");

      navigate("/dashboard");

    } else {

      alert("Invalid Username or Password");
    }

  } catch(error) {

    alert("Invalid Username or Password");
  }
};
 
  return (
    <div className="login-container">

      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="left-content">

          <FaCapsules className="medicine-icon" />

          <h1>
            DRUG INVENTORY
            <br />
            & SUPPLY CHAIN
            <br />
            TRACKING SYSTEM
          </h1>

          <div className="line"></div>

          <p>
            Right Drug, Right Quantity,
            <br />
            Right Place, Right Time
          </p>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">

        <div className="login-card">

          <div className="user-avatar">
            <FaUser />
          </div>

          <h2>Welcome Back!</h2>

          <p className="subtitle">
            Sign in to continue
          </p>

          <label>Username</label>

          <div className="input-box">
            <FaUser className="input-icon" />

            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <label>Password</label>

          <div className="input-box">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          <div className="options">

            <div>
              <input type="checkbox" />
              <span> Remember Me</span>
            </div>

            <a href="/">
              Forgot Password?
            </a>

          </div>

          <button className="login-btn" onClick={handleLogin}>
            LOGIN
          </button>

          <div className="footer">
            © 2026 Drug Inventory System
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;