import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

function About() {
    return (
        <main className="about-page">

            {/* PAGE HEADER */}

            <section className="py-5 bg-light">
                <div className="container py-lg-5 text-center">

                    <p className="hero-subtitle">
                        OUR STORY
                    </p>

                    <h1 className="display-3 fw-bold mb-3">
                        More than just coffee.
                    </h1>

                    <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
                        Café Lumière is a place where great coffee,
                        delicious food, and meaningful moments come together.
                    </p>

                </div>
            </section>

            {/* OUR STORY */}

            <section className="py-5">

                <div className="container py-lg-5">

                    <div className="row align-items-center g-5">

                        <div className="col-lg-6">

                            <div className="about-image-wrapper">

                                <img
                                    src={heroImage}
                                    alt="Inside Café Lumière"
                                    className="img-fluid rounded-4 shadow-sm"
                                    loading="lazy"
                                />

                            </div>

                        </div>

                        <div className="col-lg-6">

                            <p className="hero-subtitle">
                                WELCOME TO CAFÉ LUMIÈRE
                            </p>

                            <h2 className="display-5 fw-bold mb-4">
                                A little place with a lot of heart.
                            </h2>

                            <p className="text-muted">
                                Café Lumière was created with one simple idea:
                                to create a warm and welcoming space where
                                people can slow down, enjoy something delicious,
                                and spend time with the people who matter.
                            </p>

                            <p className="text-muted">
                                From carefully prepared coffee to comforting
                                breakfast and desserts, everything on our menu
                                is made to make your visit feel special.
                            </p>

                            <p className="text-muted">
                                Whether you're meeting a friend, working on
                                something important, or simply enjoying a quiet
                                afternoon, there's always a place for you at
                                Café Lumière.
                            </p>

                            <Link
                                to="/menu"
                                className="btn btn-dark rounded-pill px-4 mt-2"
                            >
                                Explore Our Menu
                                <i className="bi bi-arrow-right ms-2"></i>
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            {/* VALUES */}

            <section className="py-5 bg-light">

                <div className="container py-lg-5">

                    <div className="text-center mb-5">

                        <p className="hero-subtitle">
                            WHAT WE BELIEVE
                        </p>

                        <h2 className="display-5 fw-bold">
                            Simple things, done well.
                        </h2>

                    </div>

                    <div className="row g-4">

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4 text-center">

                                    <i
                                        className="bi bi-cup-hot fs-1"
                                        aria-hidden="true"
                                    ></i>

                                    <h3 className="fw-bold mt-4 h4">
                                        Great Coffee
                                    </h3>

                                    <p className="text-muted mb-0">
                                        We believe a good cup of coffee can
                                        make an ordinary moment feel special.
                                    </p>

                                </div>
                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4 text-center">

                                    <i
                                        className="bi bi-heart fs-1"
                                        aria-hidden="true"
                                    ></i>

                                    <h3 className="fw-bold mt-4 h4">
                                        Warm Hospitality
                                    </h3>

                                    <p className="text-muted mb-0">
                                        Every guest should feel comfortable,
                                        welcome, and at home.
                                    </p>

                                </div>
                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4 text-center">

                                    <i
                                        className="bi bi-stars fs-1"
                                        aria-hidden="true"
                                    ></i>

                                    <h3 className="fw-bold mt-4 h4">
                                        Quality
                                    </h3>

                                    <p className="text-muted mb-0">
                                        From our drinks to our desserts,
                                        we care about every detail.
                                    </p>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="py-5">

                <div className="container py-lg-5">

                    <div className="bg-dark text-white rounded-4 p-5 text-center">

                        <i
                            className="bi bi-cup-hot fs-1"
                            aria-hidden="true"
                        ></i>

                        <h2 className="display-6 fw-bold mt-3">
                            Come spend a moment with us.
                        </h2>

                        <p
                            className="text-white-50 mx-auto mb-4"
                            style={{ maxWidth: "600px" }}
                        >
                            Great coffee, delicious food, and a cozy
                            atmosphere are waiting for you.
                        </p>

                        <Link
                            to="/menu"
                            className="btn btn-light rounded-pill px-4"
                        >
                            View Menu
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default About;

