import React, { useState } from "react";
import axios from "axios";
import helper from "./helper/helper";

import { useNavigate } from "react-router-dom";

function FormSignUp({ token, tokenChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  if (token) {
    navigate("/");
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setMessage("Password does not match");
      return;
    }
    try {
      // Send signup request to the backend
      setMessage("");
      const response = await axios.post(`${helper}/signup`, {
        email,
        password,
      });
      const { token } = response.data;
      console.log(token);
      // Store the token in local storage
      localStorage.setItem("token", token);
      // Set the token state
      // Clear the form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/");
      window.location.reload(false);
    } catch (error) {
      setMessage("User Already Exists");
    }
  };

  return (
    <div className="signup">
      {!token && (
        <>
          <h2>Signup</h2>
          <div className="sign-message">{message && message}</div>
          <form onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Signup</button>
            <br />
          </form>
        </>
      )}
      <div className="already-user">
        Already a User? <a href="/SignIn">Sign In</a>
      </div>
    </div>
  );
}

export default FormSignUp;
