import React, { useState, useEffect } from "react";
import "../styles/Login.scss";

const AuthForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const urlParams = new URLSearchParams(window.location.search);
  const autoClose = urlParams.get("close") === "auto";

  useEffect(() => {
    // Check if the path is /signup or /login
    setMode(window.location.pathname.includes("signup") ? "signup" : "login");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      type: "login", // "signup" or "login"
      email,
      password,
      ...(mode === "signup" && { username }), // Only add username in signup
    };

    try {
      const response = await fetch("https://inlmqkmxchdb5df6t3gjdqzpqi0jrfmc.lambda-url.eu-north-1.on.aws/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log(data)

      if (data.message === "Login successful" || data.message === "User registered") {
        setMessage({ type: "success", text: `${mode === "signup" ? "Signup" : "Login"} successful!` });
        localStorage.setItem("creds", JSON.stringify(data.user_data));

        if (data.t_data) {
          if (data.t_data["transaction-id"]) {
            console.log("have tdata")
            localStorage.setItem("t_data", JSON.stringify(data.t_data));
          }
        }

        setTimeout(() => {
          if (autoClose) {
            window.close();
          } else {
            window.history.back();
          }
        }, 2000)

      } else {
        if (data.message.includes("already exists")) {
          setMessage({ type: "error", text: "User Already Exists" });
        } else {
          setMessage({ type: "error", text: data.message });
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong! " + error });
    }

    setLoading(false);
  };

  return (

    <div className="login h100 flex fdc aic jcc">
      <div className="login-container">
        <h2>{mode === "signup" ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? `${mode === "signup" ? "Signing up..." : "Logging in..."}` : mode === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>
        {message && <p className={message.type}>{message.text}</p>}
        <p>
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
          <a href={mode === "signup" ? "/login" : "/signup"}>
            {mode === "signup" ? "Login" : "Sign Up"}
          </a>
        </p>

      </div>
    </div>
  );
};

export default AuthForm;
