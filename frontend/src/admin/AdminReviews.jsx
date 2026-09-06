import { useEffect, useState } from "react";
import axios from "axios";

function AdminReviews() {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const fetchReviews = async () => {

        try {

            const token = localStorage.getItem("adminToken");

            const response = await axios.get(
                "http://localhost:5000/api/reviews/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setReviews(response.data.reviews || []);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load reviews."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchReviews();
    }, []);


    const approveReview = async (id) => {

        try {

            const token = localStorage.getItem("adminToken");

            await axios.put(
                `http://localhost:5000/api/reviews/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setReviews((currentReviews) =>
                currentReviews.map((review) =>
                    review.id === id
                        ? {
                            ...review,
                            is_approved: 1
                        }
                        : review
                )
            );

            setSuccess("Review approved successfully.");

            setTimeout(() => {
                setSuccess("");
            }, 3000);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to approve review."
            );
        }
    };


    const deleteReview = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("adminToken");

            await axios.delete(
                `http://localhost:5000/api/reviews/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setReviews((currentReviews) =>
                currentReviews.filter(
                    (review) => review.id !== id
                )
            );

            setSuccess("Review deleted successfully.");

            setTimeout(() => {
                setSuccess("");
            }, 3000);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete review."
            );
        }
    };


    const renderStars = (rating) => {

        return [...Array(5)].map((_, index) => (

            <i
                key={index}
                className={
                    index < Number(rating)
                        ? "bi bi-star-fill me-1"
                        : "bi bi-star me-1"
                }
            ></i>

        ));
    };


    const pendingCount = reviews.filter(
        (review) => Number(review.is_approved) === 0
    ).length;


    return (
        <div className="admin-dashboard">

            <div className="container py-5">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h1 className="fw-bold mb-1">
                            Reviews
                        </h1>

                        <p className="text-muted mb-0">
                            Manage customer reviews.
                        </p>

                    </div>

                    <span className="badge text-bg-warning fs-6">
                        {pendingCount} Pending
                    </span>

                </div>


                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}


                {loading ? (

                    <div className="text-center py-5">

                        <div className="spinner-border"></div>

                    </div>

                ) : reviews.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <i className="bi bi-chat-heart fs-1"></i>

                            <h4 className="fw-bold mt-3">
                                No reviews
                            </h4>

                            <p className="text-muted mb-0">
                                Customer reviews will appear here.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="row g-4">

                        {reviews.map((review) => {

                            const approved =
                                Number(review.is_approved) === 1;

                            return (

                                <div
                                    className="col-12"
                                    key={review.id}
                                >

                                    <div className="card border-0 shadow-sm">

                                        <div className="card-body p-4">

                                            <div className="d-flex justify-content-between align-items-start">

                                                <div>

                                                    <div className="d-flex align-items-center gap-2 mb-2">

                                                        <h5 className="fw-bold mb-0">
                                                            {review.customer_name}
                                                        </h5>

                                                        {approved ? (

                                                            <span className="badge text-bg-success">
                                                                Approved
                                                            </span>

                                                        ) : (

                                                            <span className="badge text-bg-warning">
                                                                Pending
                                                            </span>

                                                        )}

                                                    </div>

                                                    <div className="mb-2">
                                                        {renderStars(review.rating)}
                                                    </div>

                                                    <small className="text-muted">
                                                        {new Date(
                                                            review.created_at
                                                        ).toLocaleString()}
                                                    </small>

                                                </div>


                                                <div className="d-flex gap-2">

                                                    {!approved && (

                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() =>
                                                                approveReview(
                                                                    review.id
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-check2 me-1"></i>
                                                            Approve
                                                        </button>

                                                    )}

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            deleteReview(
                                                                review.id
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash me-1"></i>
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>


                                            <div className="bg-light rounded p-3 mt-4">

                                                {review.comment}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminReviews;