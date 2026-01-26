import { BACKEND_URL } from "../main";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useGlobalReducer";
export const Private = () => {
    const [store] = useStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const validarToken = async () => {
            if (!store.token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/private`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.token}`
                    },
                });

                if (response.ok) {
                    setLoading(false);
                } else {
                    console.error("Token inválido o expirado");
                    navigate("/login");
                }
            } catch (err) {
                setError("Error con el servidor para validar acceso");
                setLoading(false);
            }
        };

        validarToken();
    }, [store.token, navigate]);

    if (loading && !error) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                </div>
            </div>
        );
    }
    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0 text-center p-5">
                <h1 className="display-4 text-primary">Página Privada</h1>
                <hr />
                <div className="py-4">
                    <h3>¡Bienvenid@ de nuevo!</h3>
                </div>

                <div className="mt-3 text-start bg-light p-4 rounded">
                    <h5>Datos de usuario:</h5>
                    <ul className="list-group">
                        <li className="list-group-item"><strong>Correo Eléctronico:</strong> {store.user?.email}</li>
                        <li className="list-group-item"><strong>ID del Usuario:</strong> {store.user?.id}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};