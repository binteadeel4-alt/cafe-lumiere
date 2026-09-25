import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

function OrderTracking() {

    const [orderId, setOrderId] = useState("");
    const [phone, setPhone] = useState("");

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setOrder(null);

        try {

            const response = await axios.get(
                `${API_URL}/api/orders/track/${orderId.trim()}`,
                {
                    params: {
                        phone: phone.trim()
                    }
                }
            );

            if (response.data.success) {
                setOrder(response.data.order);
            }

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to find your order."
            );

        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "pending":
                return "text-bg-warning";

            case "confirmed":
                return "text-bg-info";

            case "preparing":
                return "text-bg-primary";

            case "ready":
                return "text-bg-success";

            case "completed":
                return "text-bg-success";

            case "cancelled":
                return "text-bg-danger";

            default:
                return "text-bg-secondary";
        }
    };

    return (
        <main className="order-tracking-page">

            <div className="container py-5">

                <div className="row justify-content-center">

                    <div className="col-md-8 col-lg-7">

                        <div className="mb-5 text-center">

                            <p className="hero-subtitle">
                                ORDER TRACKING
                            </p>

                            <h1 className="display-5 fw-bold">
                                Track Your Order
                            </h1>

                            <p className="text-muted">
                                Enter your order number and phone number
                                to check your order status.
                            </p>

                        </div>


                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4 p-md-5">

                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Order Number
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            value={orderId}
                                            onChange={(e) =>
                                                setOrderId(e.target.value)
                                            }
                                            placeholder="e.g. 12"
                                            min="1"
                                            required
                                        />

                                    </div>


                                    <div className="mb-4">

                                        <label className="form-label">
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            placeholder="Enter the phone number used for your order"
                                            required
                                        />

                                    </div>


                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}


                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 rounded-pill"
                                        disabled={loading}
                                    >

                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Checking Order...
                                            </>
                                        ) : (
                                            <>
                                                Track Order
                                                <i className="bi bi-search ms-2"></i>
                                            </>
                                        )}

                                    </button>

                                </form>

                            </div>

                        </div>


                        {order && (

                            <div className="card border-0 shadow-sm mt-4">

                                <div className="card-body p-4 p-md-5">

                                    <div className="d-flex justify-content-between align-items-center mb-4">

                                        <div>

                                            <p className="text-muted mb-1">
                                                Order Number
                                            </p>

                                            <h3 className="fw-bold mb-0">
                                                #{order.id}
                                            </h3>

                                        </div>

                                        <span
                                            className={`badge ${getStatusClass(order.status)} text-capitalize px-3 py-2`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>


                                    <h5 className="fw-bold mb-3">
                                        Order Items
                                    </h5>


                                    {order.items.map((item) => (

                                        <div
                                            key={item.menu_item_id}
                                            className="d-flex justify-content-between border-bottom py-3"
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


                                    <div className="d-flex justify-content-between mt-4">

                                        <strong>
                                            Total
                                        </strong>

                                        <strong>
                                            KD{" "}
                                            {Number(
                                                order.total_amount
                                            ).toFixed(3)}
                                        </strong>

                                    </div>


                                    <div className="text-center mt-4">

                                        <p className="text-muted mb-3">
                                            Your order status will update as
                                            our team processes your order.
                                        </p>

                                        <Link
                                            to="/menu"
                                            className="btn btn-outline-dark rounded-pill px-4"
                                        >
                                            Order Again
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </main>
    );
}

export default OrderTracking;