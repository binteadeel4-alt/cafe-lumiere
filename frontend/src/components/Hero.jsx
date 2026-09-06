import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

function Hero() {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="row align-items-center min-vh-75">

                    <div className="col-lg-6">
                        <p className="hero-subtitle">
                            WELCOME TO CAFÉ LUMIÈRE
                        </p>

                        <h1 className="hero-title">
                            Good coffee.
                            <br />
                            Good food.
                            <br />
                            Good moments.
                        </h1>

                        <p className="hero-text">
                            Freshly brewed coffee, delicious food, and a
                            cozy atmosphere made for slowing down and
                            enjoying the moment.
                        </p>

                        <div className="d-flex gap-3 flex-wrap">
                            <Link
                                to="/menu"
                                className="btn btn-dark btn-lg rounded-pill px-4"
                            >
                                Explore Our Menu
                            </Link>

                            <Link
                                to="/contact"
                                className="btn btn-outline-dark btn-lg rounded-pill px-4"
                            >
                                Visit Us
                            </Link>
                        </div>
                    </div>

                    <div className="col-lg-6 mt-5 mt-lg-0">
                        <div className="hero-image-wrapper">
                            <img
                                src={heroImage}
                                alt="Café Lumière"
                                className="img-fluid hero-image"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Hero;