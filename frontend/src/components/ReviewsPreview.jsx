import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function ReviewsPreview() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/reviews`);

                const items =
                    response.data?.reviews ||
                    response.data?.items ||
                    response.data ||
                    [];

                setReviews(
                    Array.isArray(items)
                        ? items.filter(
                            (review) =>
                                Number(review.is_approved) === 1 ||
                                review.is_approved === true ||
                                review.is_approved === undefined
                        ).slice(0, 3)
                        : []
                );
            } catch (err) {
                console.error("Failed to load reviews:", err);
                setError("Unable to load reviews right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <section className="reviews-preview py-5">
            <div className="container py-lg-5">

                <div className="text-center mb-5">
                    <p className="hero-subtitle">
                        WHAT PEOPLE SAY
                    </p>

                    <h2 className="display-5 fw-bold">
                        Loved by our guests.
                    </h2>
                </div>


                {loading && (
                    <div className="text-center py-4">
                        <div
                            className="spinner-border"
                            role="status"
                            aria-label="Loading reviews"
                        >
                            <span className="visually-hidden">
                                Loading reviews...
                            </span>
                        </div>
                    </div>
                )}


                {!loading && error && (
                    <div className="text-center text-muted py-4">
                        {error}
                    </div>
                )}


                {!loading && !error && reviews.length === 0 && (
                    <div className="text-center text-muted py-4">
                        No reviews available yet.
                    </div>
                )}


                {!loading && !error && reviews.length > 0 && (
                    <div className="row">

                        {reviews.map((review) => (
                            <div
                                className="col-md-4 mb-4"
                                key={review.id}
                            >
                                <div className="review-card h-100 p-4">

                                    <div
                                        className="review-stars mb-3"
                                        aria-label={`${review.rating} out of 5 stars`}
                                    >
                                        {"★".repeat(
                                            Math.min(
                                                5,
                                                Math.max(
                                                    0,
                                                    Number(review.rating) || 0
                                                )
                                            )
                                        )}
                                    </div>

                                    <p className="review-comment">
                                        "{review.comment}"
                                    </p>

                                    <p className="fw-bold mb-0">
                                        — {review.customer_name}
                                    </p>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </section>
    );
}

export default ReviewsPreview;