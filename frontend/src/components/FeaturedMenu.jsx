import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function FeaturedMenu() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchFeaturedMenu = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/menu"
                );

                setItems(response.data.items.slice(0, 6));
            } catch (error) {
                console.error("Failed to load featured menu:", error);
            }
        };

        fetchFeaturedMenu();
    }, []);

    return (
        <section className="featured-menu py-5">
            <div className="container py-lg-5">

                <div className="text-center mb-5">
                    <p className="hero-subtitle">
                        FROM OUR KITCHEN
                    </p>

                    <h2 className="display-5 fw-bold">
                        Our favorites
                    </h2>

                    <p className="text-muted mx-auto section-intro">
                        A few of the things our guests love most.
                    </p>
                </div>

                <div className="row">
                    {items.map((item) => (
                        <div
                            className="col-md-6 col-lg-4 mb-4"
                            key={item.id}
                        >
                            <div className="featured-card">

                                <img
                                    src={`http://localhost:5000${item.image}`}
                                    alt={item.name}
                                    className="featured-card-image"
                                />

                                <div className="p-4">
                                    <div className="d-flex justify-content-between gap-3">
                                        <h5 className="fw-bold">
                                            {item.name}
                                        </h5>

                                        <span className="fw-bold">
                                            KD {item.price}
                                        </span>
                                    </div>

                                    <p className="text-muted mb-0">
                                        {item.description}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <Link
                        to="/menu"
                        className="btn btn-dark rounded-pill px-4 py-2"
                    >
                        View Full Menu
                    </Link>
                </div>

            </div>
        </section>
    );
}

export default FeaturedMenu;