import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="container py-5">

                <div className="row g-4">

                    <div className="col-lg-5">
                        <h3 className="fw-bold">
                            Café Lumière
                        </h3>

                        <p className="footer-text">
                            Great coffee, delicious food, and good moments.
                        </p>
                    </div>

                    <div className="col-6 col-lg-2">
                        <h6 className="fw-bold mb-3">
                            Explore
                        </h6>

                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/">Home</Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/menu">Menu</Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/about">About</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-6 col-lg-2">
                        <h6 className="fw-bold mb-3">
                            Visit
                        </h6>

                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/gallery">Gallery</Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/reviews">Reviews</Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-3">
                        <h6 className="fw-bold mb-3">
                            Follow us
                        </h6>

                        <div className="d-flex gap-3 fs-4">
                            <a href="#" aria-label="Instagram">
                                <i className="bi bi-instagram"></i>
                            </a>

                            <a href="#" aria-label="Facebook">
                                <i className="bi bi-facebook"></i>
                            </a>

                            <a href="#" aria-label="TikTok">
                                <i className="bi bi-tiktok"></i>
                            </a>
                        </div>
                    </div>

                </div>

                <hr className="my-4" />

                <p className="text-muted mb-0 small">
                    © 2026 Café Lumière. All rights reserved.
                </p>

            </div>
        </footer>
    );
}

export default Footer;