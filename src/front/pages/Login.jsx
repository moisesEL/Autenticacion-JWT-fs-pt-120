import { BACKEND_URL } from "../main";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../hooks/useGlobalReducer";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [store, dispatch] = useStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Rellena todos los campos");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user", JSON.stringify(data.user));

                dispatch({
                    type: "login",
                    payload: {
                        token: data.token,
                        user: data.user,
                    },
                });
                navigate("/private");
            } else {
                setError(data.msg || "contraseña incorrecta");
            }
        } catch (err) {
            setError("Ocurrio un error, intentalo de nuevo");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Correo Electrónico"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Contraseña"
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                                </button>

                                <p className="text-center mb-0">
                                    ¿No tienes cuenta?{" "}
                                    <Link to="/signup">Registrarse</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
