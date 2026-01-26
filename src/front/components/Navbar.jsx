import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const [store, dispatch] = useStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch({ type: "logout" });
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">JWT Autentificación</span>
				</Link>
				<div className="ml-auto">
					{store.token ? (
						<>
							<Link to="/private" className="btn btn-success me-2">
								Página privada
							</Link>
							<button className="btn btn-danger" onClick={handleLogout}>
								Cerrar sesión
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="btn btn-primary me-2">
								Iniciar sesión
							</Link>
							<Link to="/signup" className="btn btn-secondary">
								Registrar
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};