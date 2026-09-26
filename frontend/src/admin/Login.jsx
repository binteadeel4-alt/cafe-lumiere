import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "adminToken",
                response.data.token
            );

            localStorage.setItem(
                "adminUser",
                JSON.stringify(response.data.user)
            );

            navigate("/admin/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">

            <div className="admin-login-card">

                <div className="text-center mb-4">
                    <h1 className="fw-bold">
                        Café Lumière
                    </h1>

                    <p className="text-muted mb-0">
                        Admin Dashboard
                    </p>
                </div>

                {error && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                        aria-live="assertive"
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label
                            htmlFor="admin-email"
                            className="form-label"
                        >
                            Email
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            autoComplete="email"
                            required
                        />

                    </div>

                    <div className="mb-4">

                        <label
                            htmlFor="admin-password"
                            className="form-label"
                        >
                            Password
                        </label>

                        <input
                            id="admin-password"
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn btn-dark w-100 py-2"
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;