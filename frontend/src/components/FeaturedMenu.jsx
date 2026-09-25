import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

function FeaturedMenu() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedMenu = async () => {
            try {
                const response = await axios.get(
                    `${API_URL} /api/menu`
                );

                const featuredItems = (response.data?.items || [])
                    .filter(
                        (item) =>
                            Number(item.is_featured) === 1
                    )
                    .slice(0, 6);

                setItems(featuredItems);

            } catch (error) {
                console.error(
                    "Failed to load featured menu:",
                    error
                );

            } finally {
                setLoading(false);
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

                {loading ? (

                    <div className="text-center py-4">

                        <div
                            className="spinner-border"
                            role="status"
                            aria-label="Loading featured menu"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                    </div>

                ) : items.length === 0 ? (

                    <p className="text-center text-muted">
                        Our favorites will appear here soon.
                    </p>

                ) : (

                    <div className="row">

                        {items.map((item) => (

                            <div
                                className="col-md-6 col-lg-4 mb-4"
                                key={item.id}
                            >

                                <div className="featured-card">

                                    {item.image ? (

                                        <img
                                            src={
                                                item.image.startsWith("http://") ||
                                                    item.image.startsWith("https://")
                                                    ? item.image
                                                    : `${API_URL}${item.image} `
                                            }
                                            alt={item.name}
                                            className="featured-card-image"
                                            loading="lazy"
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />

                                    ) : (

                                        <div className="featured-card-image d-flex align-items-center justify-content-center">
                                            <i className="bi bi-cup-hot fs-1"></i>
                                        </div>

                                    )}

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

                )}

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

