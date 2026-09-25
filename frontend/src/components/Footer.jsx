import { Link } from "react-router-dom";
import { CAFE_INFO, SOCIAL_LINKS } from "../config";

function Footer() {
    return (
        <footer className="footer">
            <div className="container py-5">

                <div className="row g-4">

                    <div className="col-lg-5">
                        <h3 className="fw-bold">
                            {CAFE_INFO.name}
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

                            {SOCIAL_LINKS.instagram && (
                                <a
                                    href={SOCIAL_LINKS.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >
                                    <i className="bi bi-instagram"></i>
                                </a>
                            )}

                            {SOCIAL_LINKS.facebook && (
                                <a
                                    href={SOCIAL_LINKS.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                >
                                    <i className="bi bi-facebook"></i>
                                </a>
                            )}

                            {SOCIAL_LINKS.tiktok && (
                                <a
                                    href={SOCIAL_LINKS.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TikTok"
                                >
                                    <i className="bi bi-tiktok"></i>
                                </a>
                            )}

                        </div>
                    </div>

                </div>

                <hr className="my-4" />

                <p className="text-muted mb-0 small">
                    © 2026 {CAFE_INFO.name}. All rights reserved.
                </p>

            </div>
        </footer>
    );
}

export default Footer;

