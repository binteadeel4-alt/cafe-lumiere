import { Link } from "react-router-dom";

function NotFound() {
    return (
        <main className="d-flex align-items-center justify-content-center text-center"
            style={{ minHeight: "70vh" }}
        >
            <div className="container">
                <p className="hero-subtitle">404</p>

                <h1 className="display-4 fw-bold mb-3">
                    Page Not Found
                </h1>

                <p className="text-muted mb-4">
                    Sorry, the page you're looking for doesn't exist.
                </p>

                <Link
                    to="/"
                    className="btn btn-dark rounded-pill px-4"
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}

export default NotFound;