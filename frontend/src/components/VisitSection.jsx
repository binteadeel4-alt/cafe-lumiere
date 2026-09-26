import { Link } from "react-router-dom";
import { CAFE_INFO } from "../config";

function VisitSection() {
    return (
        <section className="visit-section py-5">
            <div className="container py-lg-5">
                <div className="row align-items-center g-5">

                    <div className="col-lg-7">
                        <p className="hero-subtitle">
                            COME SAY HELLO
                        </p>

                        <h2 className="display-5 fw-bold mb-4">
                            Your next favorite café is waiting.
                        </h2>

                        <p className="text-muted visit-text">
                            Stop by for your morning coffee, meet a friend
                            for lunch, or spend a relaxing evening with us.
                        </p>

                        <div className="mt-4">

                            <p className="mb-2">
                                <i
                                    className="bi bi-geo-alt me-2"
                                    aria-hidden="true"
                                ></i>
                                Kuwait City, Kuwait
                            </p>

                            <p className="mb-2">
                                <i
                                    className="bi bi-clock me-2"
                                    aria-hidden="true"
                                ></i>
                                Daily · 8:00 AM – 11:00 PM
                            </p>

                            <p className="mb-4">
                                <i
                                    className="bi bi-telephone me-2"
                                    aria-hidden="true"
                                ></i>
                                {CAFE_INFO.phone}
                            </p>

                        </div>

                        <Link
                            to="/contact"
                            className="btn btn-dark rounded-pill px-4"
                        >
                            Contact Us
                        </Link>
                    </div>

                    <div className="col-lg-5">
                        <div className="location-box">
                            <i
                                className="bi bi-map display-1"
                                aria-hidden="true"
                            ></i>

                            <h4 className="mt-4">
                                Find us
                            </h4>

                            <p className="text-muted mb-0">
                                Kuwait City, Kuwait
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default VisitSection;

