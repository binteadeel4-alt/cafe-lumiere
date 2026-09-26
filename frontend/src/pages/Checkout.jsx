import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { useCart } from "../context/CartContext";

import { API_URL } from "../config";

function Checkout() {

    const {
        cart,
        totalPrice,
        clearCart
    } = useCart();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone: "",
        customer_email: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (cart.length === 0) {

        return (
            <main className="checkout-page">
                <div className="container py-5 text-center">

                    <i
                        className="bi bi-cart-x display-1 text-muted"
                        aria-hidden="true"
                    ></i>

                    <h1 className="fw-bold mt-4">
                        Your cart is empty
                    </h1>

                    <p className="text-muted">
                        Add some delicious items before checking out.
                    </p>

                    <Link
                        to="/menu"
                        className="btn btn-dark rounded-pill px-4"
                    >
                        Browse Menu
                    </Link>

                </div>
            </main>
        );

    }

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");

    };

    const validateForm = () => {

        const name = formData.customer_name.trim();
        const phone = formData.customer_phone.trim();
        const email = formData.customer_email.trim();

        if (!name) {
            return "Please enter your full name.";
        }

        if (name.length < 2) {
            return "Full name must contain at least 2 characters.";
        }

        if (name.length > 100) {
            return "Full name must be 100 characters or less.";
        }

        const phonePattern = /^[0-9+\-\s()]{7,20}$/;

        if (!phone) {
            return "Please enter your phone number.";
        }

        if (!phonePattern.test(phone)) {
            return "Please enter a valid phone number.";
        }

        if (email) {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                return "Please enter a valid email address.";
            }

            if (email.length > 150) {
                return "Email must be 150 characters or less.";
            }

        }

        if (cart.length === 0) {
            return "Your cart is empty.";
        }

        return "";

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {

            const orderData = {
                customer_name: formData.customer_name.trim(),
                customer_phone: formData.customer_phone.trim(),
                customer_email: formData.customer_email.trim(),

                items: cart.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await axios.post(
                `${API_URL}/api/orders`,
                orderData
            );

            if (response.data.success) {

                const order = response.data.order;

                const orderDetails = {
                    id: order.id,
                    total_amount: order.total_amount,
                    status: order.status,

                    customer_name:
                        formData.customer_name.trim(),

                    customer_phone:
                        formData.customer_phone.trim(),

                    customer_email:
                        formData.customer_email.trim(),

                    items: cart.map((item) => ({
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: Number(item.price)
                    }))
                };

                clearCart();

                navigate(
                    `/order-success/${order.id}`,
                    {
                        state: {
                            order: orderDetails
                        }
                    }
                );

            }

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to place your order. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <main className="checkout-page">

            <div className="container py-5">

                <div className="mb-5">

                    <p className="hero-subtitle">
                        CHECKOUT
                    </p>

                    <h1 className="display-5 fw-bold">
                        Complete Your Order
                    </h1>

                    <p className="text-muted">
                        Enter your details and we'll prepare your order.
                    </p>

                </div>

                <div className="row g-5">

                    {/* CUSTOMER INFORMATION */}

                    <div className="col-lg-7">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4 p-md-5">

                                <h2 className="fw-bold mb-4 h4">
                                    Customer Information
                                </h2>

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

                                    <div className="mb-3">

                                        <label
                                            htmlFor="customer-name"
                                            className="form-label"
                                        >
                                            Full Name *
                                        </label>

                                        <input
                                            id="customer-name"
                                            type="text"
                                            name="customer_name"
                                            className="form-control"
                                            value={formData.customer_name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            maxLength="100"
                                            required
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label
                                            htmlFor="customer-phone"
                                            className="form-label"
                                        >
                                            Phone Number *
                                        </label>

                                        <input
                                            id="customer-phone"
                                            type="tel"
                                            name="customer_phone"
                                            className="form-control"
                                            value={formData.customer_phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            maxLength="20"
                                            required
                                        />

                                    </div>

                                    <div className="mb-4">

                                        <label
                                            htmlFor="customer-email"
                                            className="form-label"
                                        >
                                            Email
                                        </label>

                                        <input
                                            id="customer-email"
                                            type="email"
                                            name="customer_email"
                                            className="form-control"
                                            value={formData.customer_email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            maxLength="150"
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 rounded-pill py-2"
                                        disabled={loading}
                                        aria-busy={loading}
                                    >

                                        {loading ? (

                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    aria-hidden="true"
                                                ></span>

                                                Placing Order...
                                            </>

                                        ) : (

                                            <>
                                                Place Order

                                                <i
                                                    className="bi bi-check2-circle ms-2"
                                                    aria-hidden="true"
                                                ></i>
                                            </>

                                        )}

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>


                    {/* ORDER SUMMARY */}

                    <div className="col-lg-5">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <h2 className="fw-bold mb-4 h4">
                                    Order Summary
                                </h2>

                                {cart.map((item) => (

                                    <div
                                        key={item.id}
                                        className="d-flex justify-content-between mb-3"
                                    >

                                        <div>

                                            <strong>
                                                {item.name}
                                            </strong>

                                            <div className="text-muted small">
                                                Qty: {item.quantity}
                                            </div>

                                        </div>

                                        <span>
                                            KD{" "}
                                            {(
                                                Number(item.price) *
                                                item.quantity
                                            ).toFixed(3)}
                                        </span>

                                    </div>

                                ))}

                                <hr />

                                <div className="d-flex justify-content-between">

                                    <strong>
                                        Total
                                    </strong>

                                    <strong className="fs-5">
                                        KD {totalPrice.toFixed(3)}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>

    );

}

export default Checkout;
