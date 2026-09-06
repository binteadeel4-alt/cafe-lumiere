import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

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

                    <i className="bi bi-cart-x display-1 text-muted"></i>

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const orderData = {
                ...formData,

                items: cart.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await axios.post(
                "http://localhost:5000/api/orders",
                orderData
            );

            if (response.data.success) {

                const orderId = response.data.order.id;

                clearCart();

                navigate(`/order-success/${orderId}`);
            }

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
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

                                <h4 className="fw-bold mb-4">
                                    Customer Information
                                </h4>

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Full Name *
                                        </label>

                                        <input
                                            type="text"
                                            name="customer_name"
                                            className="form-control"
                                            value={formData.customer_name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label className="form-label">
                                            Phone Number *
                                        </label>

                                        <input
                                            type="tel"
                                            name="customer_phone"
                                            className="form-control"
                                            value={formData.customer_phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            required
                                        />

                                    </div>


                                    <div className="mb-4">

                                        <label className="form-label">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="customer_email"
                                            className="form-control"
                                            value={formData.customer_email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                        />

                                    </div>


                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 rounded-pill py-2"
                                        disabled={loading}
                                    >

                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                Place Order
                                                <i className="bi bi-check2-circle ms-2"></i>
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

                                <h4 className="fw-bold mb-4">
                                    Order Summary
                                </h4>


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