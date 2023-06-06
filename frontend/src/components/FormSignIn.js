import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import helper from "./helper/helper";

function FormSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  if (token) {
    navigate("/");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post(`${helper}/login`, { email, password });
      const { token } = response.data;

      // Store the token in local storage
      localStorage.setItem("token", token);
      setToken(localStorage.getItem("token", token));
      // Set the token state
      // Clear the form
      setMessage("");
      setEmail("");
      setPassword("");
      navigate("/");
      window.location.reload(false);
    } catch (error) {
      setMessage("Invalid Email or Password");
    }
  };

  return (
    <div className="login">
      {!token && (
        <>
          <h2>Login</h2>
          <div className="sign-message">{message && message}</div>
          <div className="login-form">
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="on"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
          <div className="is-new-user">
            New User? <a href="/SignUp">Sign Up</a>
          </div>
        </>
      )}
    </div>
  );
}

export default FormSignIn;
