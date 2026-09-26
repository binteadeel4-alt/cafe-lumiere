import { useState } from "react";
import axios from "axios";
import { API_URL, CAFE_INFO } from "../config";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const response = await axios.post(
                `${API_URL}/api/messages`,
                formData
            );

            if (response.data.success) {
                setSuccess(
                    "Your message has been sent successfully!"
                );

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                });
            }

        } catch (error) {
            console.error("CONTACT ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to send your message. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="contact-page">

            {/* HEADER */}

            <section className="menu-header">
                <div className="container text-center py-5">

                    <p className="hero-subtitle">
                        GET IN TOUCH
                    </p>

                    <h1 className="display-3 fw-bold">
                        Contact Us
                    </h1>

                    <p className="text-muted mx-auto menu-intro">
                        Have a question, suggestion, or just want to
                        say hello? We'd love to hear from you.
                    </p>

                </div>
            </section>

            {/* CONTACT SECTION */}

            <section className="pb-5">

                <div className="container">

                    <div className="row g-5">

                        {/* CONTACT INFORMATION */}

                        <div className="col-lg-5">

                            <h3 className="fw-bold mb-4">
                                We'd love to hear from you
                            </h3>

                            <p className="text-muted mb-4">
                                Whether you have a question about our
                                menu, an order, or anything else,
                                feel free to reach out.
                            </p>

                            <div className="d-flex mb-4">

                                <div className="me-3">
                                    <i className="bi bi-geo-alt fs-3" aria-hidden="true"></i>
                                </div>

                                <div>
                                    <h6 className="fw-bold mb-1">
                                        Location
                                    </h6>

                                    <p className="text-muted mb-0">
                                        {CAFE_INFO.name}
                                    </p>
                                </div>

                            </div>

                            <div className="d-flex mb-4">

                                <div className="me-3">
                                    <i className="bi bi-telephone fs-3" aria-hidden="true"></i>
                                </div>

                                <div>
                                    <h6 className="fw-bold mb-1">
                                        Phone
                                    </h6>

                                    <p className="text-muted mb-0">
                                        {CAFE_INFO.phone}
                                    </p>
                                </div>

                            </div>

                            <div className="d-flex mb-4">

                                <div className="me-3">
                                    <i className="bi bi-envelope fs-3" aria-hidden="true"></i>
                                </div>

                                <div>
                                    <h6 className="fw-bold mb-1">
                                        Email
                                    </h6>

                                    <p className="text-muted mb-0">
                                        {CAFE_INFO.email}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* FORM */}

                        <div className="col-lg-7">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body p-4 p-md-5">

                                    <h4 className="fw-bold mb-4">
                                        Send us a message
                                    </h4>

                                    {success && (
                                        <div
                                            className="alert alert-success"
                                            role="alert"
                                            aria-live="polite"
                                        >
                                            {success}
                                        </div>
                                    )}

                                    {error && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                            aria-live="assertive"
                                        >
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>

                                        <div className="row">

                                            <div className="col-md-6 mb-3">

                                                <label className="form-label">
                                                    Name *
                                                </label>

                                                <input
                                                    id="contact-name"
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Your name"
                                                    required
                                                />

                                            </div>

                                            <div className="col-md-6 mb-3">

                                                <label className="form-label">
                                                    Email *
                                                </label>

                                                <input
                                                    id="contact-email"
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Your email"
                                                    required
                                                />

                                            </div>

                                        </div>

                                        <div className="mb-3">

                                            <label className="form-label">
                                                Phone
                                            </label>

                                            <input
                                                id="contact-phone"
                                                type="tel"
                                                name="phone"
                                                className="form-control"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Your phone number"
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label className="form-label">
                                                Subject *
                                            </label>

                                            <input
                                                id="contact-subject"
                                                type="text"
                                                name="subject"
                                                className="form-control"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="What is this about?"
                                                required
                                            />

                                        </div>

                                        <div className="mb-4">

                                            <label className="form-label">
                                                Message *
                                            </label>

                                            <textarea
                                                id="contact-message"
                                                name="message"
                                                className="form-control"
                                                rows="5"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Write your message..."
                                                required
                                            ></textarea>

                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-dark rounded-pill px-4"
                                            disabled={loading}
                                        >

                                            {loading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <i
                                                        className="bi bi-send ms-2"
                                                        aria-hidden="true"
                                                    ></i>
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

        </main>
    );
}

export default Contact;

