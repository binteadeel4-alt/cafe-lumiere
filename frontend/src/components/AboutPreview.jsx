import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

function AboutPreview() {
    return (
        <section className="about-preview py-5">
            <div className="container py-lg-5">

                <div className="row align-items-center g-5">

                    <div className="col-lg-6">
                        <div className="about-image-wrapper">
                            <img
                                src={heroImage}
                                alt="Inside Café Lumière"
                                className="about-image"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <p className="hero-subtitle">
                            OUR STORY
                        </p>

                        <h2 className="display-5 fw-bold mb-4">
                            More than just a cup of coffee.
                        </h2>

                        <p className="text-muted about-text">
                            Café Lumière was created with one simple idea:
                            create a place where great coffee, delicious
                            food, and meaningful moments come together.
                        </p>

                        <p className="text-muted about-text">
                            Whether you're catching up with friends,
                            working on your next big idea, or simply
                            enjoying a quiet afternoon, there's always
                            a seat waiting for you.
                        </p>

                        <Link
                            to="/about"
                            className="btn btn-dark rounded-pill px-4 py-2 mt-2"
                        >
                            Discover Our Story
                        </Link>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default AboutPreview;

