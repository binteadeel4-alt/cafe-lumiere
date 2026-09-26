import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.get(
                `${API_URL}/api/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOrders(response.data.orders);

        } catch (error) {
            console.error(error);
            setError("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem("adminToken");

            await axios.put(
                `${API_URL}/api/orders/${orderId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Order status updated.");
            setError("");

            setTimeout(() => {
                setSuccess("");
            }, 3000);

            await fetchOrders();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update order."
            );
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
                return "text-bg-dark";

            case "cancelled":
                return "text-bg-danger";

            default:
                return "text-bg-secondary";
        }
    };

    return (
        <div className="admin-dashboard">

            <div className="container py-5">

                <div className="mb-4">
                    <h1 className="fw-bold mb-1">
                        Orders
                    </h1>

                    <p className="text-muted">
                        Manage customer orders.
                    </p>
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
                            className="spinner-border"
                            aria-hidden="true"
                        ></div>

                        <p className="text-muted mt-3 mb-0">
                            Loading orders...
                        </p>
                    </div>

                ) : orders.length === 0 ? (

                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">

                            <i
                                className="bi bi-bag-x fs-1"
                                aria-hidden="true"
                            ></i>

                            <h2 className="h4 mt-3">
                                No orders yet
                            </h2>

                            <p className="text-muted mb-0">
                                Customer orders will appear here.
                            </p>

                        </div>
                    </div>

                ) : (

                    <div className="row g-4">

                        {orders.map((order) => (

                            <div
                                className="col-12"
                                key={order.id}
                            >

                                <div className="card border-0 shadow-sm">

                                    <div className="card-body p-4">

                                        <div className="d-flex justify-content-between align-items-start mb-4">

                                            <div>
                                                <h2 className="h4 fw-bold mb-1">
                                                    Order #{order.id}
                                                </h2>

                                                <p className="text-muted mb-0">
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleString()}
                                                </p>
                                            </div>

                                            <span
                                                className={`badge ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    order.status.slice(1)}
                                            </span>

                                        </div>


                                        <div className="row">

                                            {/* CUSTOMER */}

                                            <div className="col-md-4">

                                                <h3 className="h6 fw-bold">
                                                    Customer
                                                </h3>

                                                <p className="mb-1">
                                                    {order.customer_name}
                                                </p>

                                                <p className="text-muted mb-1">
                                                    {order.customer_phone}
                                                </p>

                                                {order.customer_email && (
                                                    <p className="text-muted">
                                                        {order.customer_email}
                                                    </p>
                                                )}

                                            </div>


                                            {/* ITEMS */}

                                            <div className="col-md-4">

                                                <h3 className="h6 fw-bold">
                                                    Items
                                                </h3>

                                                {order.items.map((item) => (

                                                    <div
                                                        key={item.menu_item_id}
                                                        className="d-flex justify-content-between"
                                                    >
                                                        <span>
                                                            {item.name} ×{" "}
                                                            {item.quantity}
                                                        </span>

                                                        <span>
                                                            KD{" "}
                                                            {(
                                                                Number(
                                                                    item.price
                                                                ) *
                                                                item.quantity
                                                            ).toFixed(3)}
                                                        </span>
                                                    </div>

                                                ))}

                                            </div>


                                            {/* TOTAL + STATUS */}

                                            <div className="col-md-4">

                                                <h3 className="h6 fw-bold">
                                                    Total
                                                </h3>

                                                <h4 className="fw-bold">
                                                    KD{" "}
                                                    {Number(
                                                        order.total_amount
                                                    ).toFixed(3)}
                                                </h4>

                                                <label
                                                    htmlFor={`order-status-${order.id}`}
                                                    className="form-label mt-2"
                                                >
                                                    Update Status
                                                </label>

                                                <select
                                                    id={`order-status-${order.id}`}
                                                    className="form-select"
                                                    value={order.status}
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            order.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="pending">
                                                        Pending
                                                    </option>

                                                    <option value="confirmed">
                                                        Confirmed
                                                    </option>

                                                    <option value="preparing">
                                                        Preparing
                                                    </option>

                                                    <option value="ready">
                                                        Ready
                                                    </option>

                                                    <option value="completed">
                                                        Completed
                                                    </option>

                                                    <option value="cancelled">
                                                        Cancelled
                                                    </option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Orders;