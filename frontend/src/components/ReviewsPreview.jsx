function ReviewsPreview() {
    const reviews = [
        {
            name: "Sarah",
            rating: 5,
            comment: "Beautiful atmosphere and amazing coffee. Definitely coming back!"
        },
        {
            name: "Ahmed",
            rating: 5,
            comment: "The food was fresh, delicious, and beautifully presented."
        },
        {
            name: "Maya",
            rating: 5,
            comment: "Such a cozy place. Perfect for spending an afternoon with friends."
        }
    ];

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

                <div className="row">
                    {reviews.map((review, index) => (
                        <div
                            className="col-md-4 mb-4"
                            key={index}
                        >
                            <div className="review-card h-100 p-4">

                                <div className="review-stars mb-3">
                                    {"★".repeat(review.rating)}
                                </div>

                                <p className="review-comment">
                                    "{review.comment}"
                                </p>

                                <p className="fw-bold mb-0">
                                    — {review.name}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default ReviewsPreview;