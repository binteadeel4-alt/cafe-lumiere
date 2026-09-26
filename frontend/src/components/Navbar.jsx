import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CAFE_INFO } from "../config";

function Navbar() {
    const { totalItems } = useCart();

    return (
        <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm">
            <div className="container">

                <Link
                    className="navbar-brand fw-bold fs-3"
                    to="/"
                >
                    {CAFE_INFO.name}
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span
                        className="navbar-toggler-icon"
                        aria-hidden="true"
                    ></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/"
                            >
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/menu"
                            >
                                Menu
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/about"
                            >
                                About
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/gallery"
                            >
                                Gallery
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/reviews"
                            >
                                Reviews
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/cart"
                            >
                                <i
                                    className="bi bi-cart3 me-1"
                                    aria-hidden="true"
                                ></i>

                                Cart

                                {totalItems > 0 && (
                                    <span
                                        className="badge bg-dark ms-1"
                                        aria-label={`${totalItems} items in cart`}
                                    >
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="btn btn-dark px-4 rounded-pill"
                                to="/contact"
                            >
                                Contact Us
                            </Link>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;

