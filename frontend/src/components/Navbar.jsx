import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h2>InterviewTrack</h2>

            <div className="nav-links">
                {isAuthenticated ? (
                    <>
                        <span className="user-name">Hi, {user?.name}</span>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/applications">Applications</Link>
                        <Link to="/applications/new">Add Application</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;