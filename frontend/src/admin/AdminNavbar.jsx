import { Link, NavLink, useNavigate } from "react-router-dom";

function AdminNavbar() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("adminUser")
    );

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin/login");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container">

                <Link
                    to="/admin/dashboard"
                    className="navbar-brand fw-bold"
                >
                    Café Lumière
                    <span className="text-secondary ms-2">
                        Admin
                    </span>
                </Link>


                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#adminNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div
                    className="collapse navbar-collapse"
                    id="adminNavbar"
                >

                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

                        <li className="nav-item">
                            <NavLink
                                to="/admin/dashboard"
                                className="nav-link"
                            >
                                <i className="bi bi-speedometer2 me-1"></i>
                                Dashboard
                            </NavLink>
                        </li>


                        <li className="nav-item">
                            <NavLink
                                to="/admin/menu"
                                className="nav-link"
                            >
                                <i className="bi bi-cup-hot me-1"></i>
                                Menu
                            </NavLink>
                        </li>


                        <li className="nav-item">
                            <NavLink
                                to="/admin/orders"
                                className="nav-link"
                            >
                                <i className="bi bi-bag-check me-1"></i>
                                Orders
                            </NavLink>
                        </li>


                        <li className="nav-item">
                            <NavLink
                                to="/admin/messages"
                                className="nav-link"
                            >
                                <i className="bi bi-envelope me-1"></i>
                                Messages
                            </NavLink>
                        </li>


                        <li className="nav-item">
                            <NavLink
                                to="/admin/reviews"
                                className="nav-link"
                            >
                                <i className="bi bi-star me-1"></i>
                                Reviews
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/admin/gallery"
                                className="nav-link"
                            >
                                <i className="bi bi-images me-1"></i>
                                Gallery
                            </NavLink>
                        </li>


                        <li className="nav-item dropdown">

                            <button
                                className="nav-link dropdown-toggle border-0 bg-transparent"
                                data-bs-toggle="dropdown"
                            >
                                <i className="bi bi-person-circle me-1"></i>
                                {user?.name || "Admin"}
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end">

                                <li>
                                    <Link
                                        to="/"
                                        className="dropdown-item"
                                    >
                                        <i className="bi bi-house me-2"></i>
                                        View Website
                                    </Link>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Logout
                                    </button>
                                </li>

                            </ul>

                        </li>

                    </ul>

                </div>

            </div>
        </nav>
    );
}

export default AdminNavbar;