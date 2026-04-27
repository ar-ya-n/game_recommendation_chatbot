/**
 * 🎮 Login Page
 * Auth page with login/signup toggle.
 */

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, username, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__icon">🎮</div>
        <h1 className="login-card__title">GameGuide AI</h1>
        <p className="login-card__subtitle">
          {isSignup ? "Create your account" : "Welcome back, gamer!"}
        </p>

        {error && <div className="login-card__error">{error}</div>}

        <form className="login-card__form" onSubmit={handleSubmit}>
          <input
            className="login-card__input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="login-email"
          />
          {isSignup && (
            <input
              className="login-card__input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              id="login-username"
            />
          )}
          <input
            className="login-card__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="login-password"
          />
          <button className="login-card__submit" type="submit" disabled={loading} id="login-submit">
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="login-card__toggle">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button onClick={() => { setIsSignup(!isSignup); setError(""); }} id="login-toggle">
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
