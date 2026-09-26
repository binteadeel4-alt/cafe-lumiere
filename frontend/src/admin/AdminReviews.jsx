import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function AdminReviews() {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("adminToken");

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/api/reviews/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const reviewsData = Array.isArray(response.data)
                ? response.data
                : response.data.reviews || [];

            setReviews(reviewsData);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load reviews."
            );

            setReviews([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const approveReview = async (id) => {

        try {

            setError("");
            setSuccess("");

            await axios.put(
                `${API_URL}/api/reviews/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Review approved successfully.");

            fetchReviews();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to approve review."
            );

        }
    };

    const deleteReview = async (id) => {

        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await axios.delete(
                `${API_URL}/api/reviews/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Review deleted successfully.");

            fetchReviews();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete review."
            );

        }
    };

    const renderStars = (rating) => {

        const safeRating = Math.min(
            5,
            Math.max(
                0,
                Number(rating) || 0
            )
        );

        return (
            <>
                {[...Array(5)].map((_, index) => (
                    <i
                        key={index}
                        className={
                            index < safeRating
                                ? "bi bi-star-fill"
                                : "bi bi-star"
                        }
                        aria-hidden="true"
                    ></i>
                ))}
            </>
        );
    };

    return (
        <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h1 className="fw-bold mb-1">
                        Reviews
                    </h1>

                    <p className="text-muted mb-0">
                        Manage customer reviews and approvals.
                    </p>
                </div>

            </div>

            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                    aria-live="assertive"
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    className="alert alert-success"
                    role="status"
                    aria-live="polite"
                >
                    {success}
                </div>
            )}

            {loading ? (

                <div
                    className="text-center py-5"
                    role="status"
                    aria-live="polite"
                >
                    <div
                        className="spinner-border text-dark"
                        aria-hidden="true"
                    ></div>

                    <p className="text-muted mt-3 mb-0">
                        Loading reviews...
                    </p>
                </div>

            ) : reviews.length === 0 ? (

                <div className="text-center py-5">

                    <i
                        className="bi bi-chat-heart fs-1 text-muted"
                        aria-hidden="true"
                    ></i>

                    <h2 className="h4 mt-3">
                        No reviews found
                    </h2>

                    <p className="text-muted">
                        Customer reviews will appear here.
                    </p>

                </div>

            ) : (

                <div className="row g-4">

                    {reviews.map((review) => (

                        <div
                            className="col-md-6 col-lg-4"
                            key={review.id}
                        >

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-start mb-3">

                                        <div>

                                            <h2 className="h5 fw-bold mb-1">
                                                {review.customer_name}
                                            </h2>

                                            <small className="text-muted">
                                                {new Date(
                                                    review.created_at
                                                ).toLocaleDateString()}
                                            </small>

                                        </div>

                                        {review.is_approved ? (

                                            <span className="badge bg-success">
                                                Approved
                                            </span>

                                        ) : (

                                            <span className="badge bg-warning text-dark">
                                                Pending
                                            </span>

                                        )}

                                    </div>

                                    <div
                                        className="mb-3"
                                        role="img"
                                        aria-label={`${review.rating} out of 5 stars`}
                                    >
                                        <span aria-hidden="true">
                                            {renderStars(review.rating)}
                                        </span>
                                    </div>

                                    <p className="text-muted mb-4">
                                        {review.comment}
                                    </p>

                                    <div className="d-flex gap-2">

                                        {!review.is_approved && (
                                            <button
                                                type="button"
                                                className="btn btn-dark btn-sm rounded-pill flex-grow-1"
                                                onClick={() =>
                                                    approveReview(review.id)
                                                }
                                            >
                                                <i
                                                    className="bi bi-check-circle me-1"
                                                    aria-hidden="true"
                                                ></i>
                                                Approve
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm rounded-pill"
                                            onClick={() =>
                                                deleteReview(review.id)
                                            }
                                            aria-label={`Delete review by ${review.customer_name}`}
                                        >
                                            <i
                                                className="bi bi-trash"
                                                aria-hidden="true"
                                            ></i>
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default AdminReviews;