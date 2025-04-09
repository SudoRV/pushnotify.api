import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "../styles/ResetPassword.scss";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [response, setResponse] = useState("");
    const [email, setEmail] = useState(null);
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setResponse("Invalid reset token.");
            setTokenValid(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const expiration = decoded.exp * 1000;
            const now = Date.now();

            if (now > expiration) {
                setResponse("Reset token has expired.");
                setTokenValid(false);
            } else {
                setEmail(decoded.email);
                setTokenValid(true);
            }
        } catch (err) {
            setResponse("Invalid reset token.");
            setTokenValid(false);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse("");

        if (password !== confirmPassword) {
            setResponse("Passwords do not match.");
            return;
        }

        const BASE_URL = "https://inlmqkmxchdb5df6t3gjdqzpqi0jrfmc.lambda-url.eu-north-1.on.aws/";

        try {
            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "reset-password",
                    token: searchParams.get("token"),
                    email,
                    password,
                })
            });

            const response = await res.json();

            if (response.success) {
                setResponse("Password reset successfully!")
                await alert("Password reset successfully!");
                setTimeout(() => {
                    window.close();
                }, 2000)
            } else {
                setResponse(response.message);
            }
        } catch (err) {
            setResponse("Failed to reset password." + err);
        }
    };

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h2>Reset Password</h2>

                {response && <p className={response.includes("successfully") ? "message" : "expired-message"}>{response}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={!tokenValid}
                            className={!tokenValid ? "disabled" : ""}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={!tokenValid}
                            className={!tokenValid ? "disabled" : ""}
                        />
                    </div>

                    <button type="submit" className={`submit-btn ${!tokenValid ? "disabled" : ""}`} disabled={!tokenValid}>
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
