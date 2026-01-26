import { BACKEND_URL } from "../main";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Rellena todos los campos");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Contraseña minimo 8 caracteres de longitud");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/login");
            } else {
                setError(data.msg || "Fallo en crear cuenta");
            }
        } catch (err) {
            setError("Ocurrio un error, intente de nuevo");
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
                            <h2 className="card-title text-center mb-4">Registrarse</h2>

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
                                        placeholder="Correo electronico"
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
                                    {loading ? "Creando cuenta" : "Registrarse"}
                                </button>

                                <p className="text-center mb-0">
                                    ¿Tienes una cuenta creada?{" "}
                                    <Link to="/login">Iniciar sesión</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
