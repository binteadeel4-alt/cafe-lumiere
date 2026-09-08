import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Reviews() {

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        customer_name: "",
        rating: 5,
        comment: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState("");


    const fetchReviews = async () => {
        try {

            const response = await axios.get(
                "https://cafe-lumiere-production.up.railway.app/api/reviews"
            );

            setReviews(response.data.reviews || []);

        } catch (error) {

            console.error(error);

            setError("Unable to load customer reviews.");

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchReviews();
    }, []);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitting(true);
        setSuccess("");
        setError("");

        try {

            const response = await axios.post(
                "https://cafe-lumiere-production.up.railway.app/api/reviews",
                {
                    customer_name: formData.customer_name,
                    rating: Number(formData.rating),
                    comment: formData.comment
                }
            );

            if (response.data.success) {

                setSuccess(
                    "Thank you! Your review has been submitted and is waiting for approval."
                );

                setFormData({
                    customer_name: "",
                    rating: 5,
                    comment: ""
                });
            }

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to submit your review."
            );

        } finally {

            setSubmitting(false);

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


    return (
        <main className="reviews-page">

            {/* HEADER */}

            <section className="py-5 bg-light">

                <div className="container py-lg-5 text-center">

                    <p className="hero-subtitle">
                        CUSTOMER LOVE
                    </p>

                    <h1 className="display-3 fw-bold mb-3">
                        What our guests say.
                    </h1>

                    <p
                        className="text-muted mx-auto"
                        style={{ maxWidth: "700px" }}
                    >
                        Good coffee is better when it's shared.
                        Here's what our guests have to say
                        about their Café Lumière experience.
                    </p>

                </div>

            </section>


            {/* REVIEWS */}

            <section className="py-5">

                <div className="container py-lg-4">

                    {loading && (

                        <div className="text-center py-5">

                            <div
                                className="spinner-border"
                                role="status"
                            />

                        </div>

                    )}


                    {!loading && error && (

                        <div className="alert alert-danger text-center">
                            {error}
                        </div>

                    )}


                    {!loading &&
                        !error &&
                        reviews.length === 0 && (

                            <div className="text-center py-5">

                                <i className="bi bi-chat-heart fs-1"></i>

                                <h4 className="fw-bold mt-3">
                                    No reviews yet
                                </h4>

                                <p className="text-muted">
                                    Be the first to share your experience!
                                </p>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        reviews.length > 0 && (

                            <div className="row g-4">

                                {reviews.map((review) => (

                                    <div
                                        className="col-md-6 col-lg-4"
                                        key={review.id}
                                    >

                                        <div className="card border-0 shadow-sm h-100">

                                            <div className="card-body p-4">

                                                <div className="mb-3">
                                                    {renderStars(
                                                        review.rating
                                                    )}
                                                </div>

                                                <p className="text-muted mb-4">
                                                    "{review.comment}"
                                                </p>

                                                <div className="d-flex align-items-center">

                                                    <div
                                                        className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center me-3"
                                                        style={{
                                                            width: "48px",
                                                            height: "48px"
                                                        }}
                                                    >
                                                        {review.customer_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <h6 className="fw-bold mb-0">
                                                            {review.customer_name}
                                                        </h6>

                                                        <small className="text-muted">
                                                            Customer
                                                        </small>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                </div>

            </section>


            {/* WRITE REVIEW */}

            <section className="py-5 bg-light">

                <div className="container">

                    <div className="row justify-content-center">

                        <div className="col-lg-7">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body p-4 p-md-5">

                                    <div className="text-center mb-4">

                                        <i className="bi bi-chat-heart fs-1"></i>

                                        <h2 className="fw-bold mt-3">
                                            Share Your Experience
                                        </h2>

                                        <p className="text-muted">
                                            We'd love to hear what you think
                                            about Café Lumière.
                                        </p>

                                    </div>


                                    {success && (
                                        <div className="alert alert-success">
                                            {success}
                                        </div>
                                    )}


                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}


                                    <form onSubmit={handleSubmit}>

                                        <div className="mb-3">

                                            <label className="form-label fw-semibold">
                                                Your Name
                                            </label>

                                            <input
                                                type="text"
                                                name="customer_name"
                                                className="form-control"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                placeholder="Enter your name"
                                                required
                                            />

                                        </div>


                                        <div className="mb-3">

                                            <label className="form-label fw-semibold">
                                                Your Rating
                                            </label>

                                            <select
                                                name="rating"
                                                className="form-select"
                                                value={formData.rating}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="5">
                                                    ⭐⭐⭐⭐⭐ — Excellent
                                                </option>

                                                <option value="4">
                                                    ⭐⭐⭐⭐ — Very Good
                                                </option>

                                                <option value="3">
                                                    ⭐⭐⭐ — Good
                                                </option>

                                                <option value="2">
                                                    ⭐⭐ — Fair
                                                </option>

                                                <option value="1">
                                                    ⭐ — Poor
                                                </option>

                                            </select>

                                        </div>


                                        <div className="mb-4">

                                            <label className="form-label fw-semibold">
                                                Your Review
                                            </label>

                                            <textarea
                                                name="comment"
                                                className="form-control"
                                                rows="5"
                                                value={formData.comment}
                                                onChange={handleChange}
                                                placeholder="Tell us about your experience..."
                                                required
                                            />

                                        </div>


                                        <button
                                            type="submit"
                                            className="btn btn-dark w-100 rounded-pill py-2"
                                            disabled={submitting}
                                        >

                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Review
                                                    <i className="bi bi-send ms-2"></i>
                                                </>
                                            )}

                                        </button>

                                    </form>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* CTA */}

            <section className="py-5">

                <div className="container text-center py-4">

                    <i className="bi bi-heart-fill fs-1"></i>

                    <h2 className="fw-bold mt-3">
                        Your experience matters to us.
                    </h2>

                    <p
                        className="text-muted mx-auto"
                        style={{ maxWidth: "600px" }}
                    >
                        Thank you for being part of the Café Lumière story.
                    </p>

                    <Link
                        to="/contact"
                        className="btn btn-dark rounded-pill px-4"
                    >
                        Contact Us
                        <i className="bi bi-arrow-right ms-2"></i>
                    </Link>

                </div>

            </section>

        </main>
    );
}

export default Reviews;