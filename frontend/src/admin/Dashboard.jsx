import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

function Dashboard() {
    const user = JSON.parse(
        localStorage.getItem("adminUser")
    );

    const [stats, setStats] = useState({
        totalMenuItems: 0,
        availableItems: 0,
        totalCategories: 0,
        totalOrders: 0,
        pendingOrders: 0,
        preparingOrders: 0,
        completedOrders: 0,
        totalSales: 0,
        unreadMessages: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                const response = await axios.get(
                    `${API_URL}/api/dashboard/stats`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setStats(response.data.stats);

            } catch (error) {
                console.error(
                    "Failed to load dashboard:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard">

            <div className="container py-5">

                {/* HEADER */}

                <div className="d-flex justify-content-between align-items-center mb-5">

                    <div>
                        <h1 className="fw-bold">
                            Dashboard
                        </h1>

                        <p className="text-muted mb-0">
                            Welcome back, {user?.name}
                        </p>
                    </div>

                </div>


                {/* MENU STATISTICS */}

                <h2 className="fw-bold mb-3">
                    Menu Overview
                </h2>

                <div className="row g-4 mb-5">

                    {/* TOTAL MENU */}

                    <div className="col-md-4">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-cup-hot fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Total Menu Items
                            </h3>

                            <h4 className="fw-bold">
                                {loading
                                    ? "..."
                                    : stats.totalMenuItems}
                            </h4>

                            <Link
                                to="/admin/menu"
                                className="btn btn-dark rounded-pill mt-2"
                            >
                                Manage Menu
                            </Link>

                        </div>

                    </div>


                    {/* AVAILABLE */}

                    <div className="col-md-4">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-check-circle fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Available Items
                            </h3>

                            <h4 className="fw-bold">
                                {loading
                                    ? "..."
                                    : stats.availableItems}
                            </h4>

                            <p className="text-muted mb-0">
                                Currently available
                            </p>

                        </div>

                    </div>


                    {/* CATEGORIES */}

                    <div className="col-md-4">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-grid fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Categories
                            </h3>

                            <h4 className="fw-bold">
                                {loading
                                    ? "..."
                                    : stats.totalCategories}
                            </h4>

                            <p className="text-muted mb-0">
                                Menu categories
                            </p>

                        </div>

                    </div>

                </div>


                {/* ORDER STATISTICS */}

                <h2 className="fw-bold mb-3">
                    Order Overview
                </h2>

                <div className="row g-4 mb-5">

                    {/* TOTAL ORDERS */}

                    <div className="col-md-6 col-lg-3">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-bag-check fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Total Orders
                            </h3>

                            <h4 className="fw-bold">
                                {loading
                                    ? "..."
                                    : stats.totalOrders}
                            </h4>

                            <Link
                                to="/admin/orders"
                                className="btn btn-dark rounded-pill mt-2"
                            >
                                View Orders
                            </Link>

                        </div>

                    </div>


                    {/* PENDING */}

                    <div className="col-md-6 col-lg-3">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-hourglass-split fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Pending Orders
                            </h3>

                            <h4 className="fw-bold">
                                {loading
                                    ? "..."
                                    : stats.pendingOrders}
                            </h4>

                            <p className="text-muted mb-0">
                                Awaiting confirmation
                            </p>

                        </div>

                    </div>


                    {/* PREPARING */}

                    <div className="col-md-6 col-lg-3">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-fire fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Preparing
                            </h3>

                            <h4 className="fw-bold">
                                {loading
                                    ? "..."
                                    : stats.preparingOrders}
                            </h4>

                            <p className="text-muted mb-0">
                                Currently preparing
                            </p>

                        </div>

                    </div>


                    {/* COMPLETED */}

                    <div className="col-md-6 col-lg-3">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-check2-all fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Completed
                            </h3>

                            <h4 className="fw-bold">
                                {loading
                                    ? "..."
                                    : stats.completedOrders}
                            </h4>

                            <p className="text-muted mb-0">
                                Successfully completed
                            </p>

                        </div>

                    </div>


                    {/* UNREAD MESSAGES */}

                    <div className="col-md-6 col-lg-3">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-envelope fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Unread Messages
                            </h3>

                            <h4 className="fw-bold">
                                {loading
                                    ? "..."
                                    : stats.unreadMessages}
                            </h4>

                            <Link
                                to="/admin/messages"
                                className="btn btn-dark rounded-pill mt-2"
                            >
                                View Messages
                            </Link>

                        </div>

                    </div>

                </div>


                {/* SALES */}

                <div className="row g-4 mb-5">

                    {/* TOTAL SALES */}

                    <div className="col-md-6">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-cash-stack fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Total Sales
                            </h3>

                            <h4 className="fw-bold">
                                KD{" "}
                                {loading
                                    ? "..."
                                    : Number(
                                        stats.totalSales
                                    ).toFixed(3)}
                            </h4>

                            <p className="text-muted mb-0">
                                From completed orders
                            </p>

                        </div>

                    </div>


                    {/* ORDER MANAGEMENT */}

                    <div className="col-md-6">

                        <div className="admin-stat-card">

                            <i
                                className="bi bi-arrow-up-right-circle fs-1"
                                aria-hidden="true"
                            ></i>

                            <h3 className="h6 text-muted mt-3">
                                Order Management
                            </h3>

                            <p className="text-muted">
                                View customer orders and
                                update their status.
                            </p>

                            <Link
                                to="/admin/orders"
                                className="btn btn-dark rounded-pill"
                            >
                                Manage Orders
                            </Link>

                        </div>

                    </div>

                </div>


                {/* QUICK LINKS */}

                <h2 className="fw-bold mb-3">
                    Quick Actions
                </h2>

                <div className="row g-4">

                    {/* MENU */}

                    <div className="col-md-4">

                        <Link
                            to="/admin/menu"
                            className="text-decoration-none text-dark"
                        >

                            <div className="admin-stat-card">

                                <i
                                    className="bi bi-pencil-square fs-1"
                                    aria-hidden="true"
                                ></i>

                                <h3 className="h4 mt-3">
                                    Manage Menu
                                </h3>

                                <p className="text-muted mb-0">
                                    Add, edit or remove menu items.
                                </p>

                            </div>

                        </Link>

                    </div>


                    {/* ORDERS */}

                    <div className="col-md-4">

                        <Link
                            to="/admin/orders"
                            className="text-decoration-none text-dark"
                        >

                            <div className="admin-stat-card">

                                <i
                                    className="bi bi-bag fs-1"
                                    aria-hidden="true"
                                ></i>

                                <h3 className="h4 mt-3">
                                    Manage Orders
                                </h3>

                                <p className="text-muted mb-0">
                                    Track and update customer orders.
                                </p>

                            </div>

                        </Link>

                    </div>


                    {/* MESSAGES */}

                    <div className="col-md-4">

                        <Link
                            to="/admin/messages"
                            className="text-decoration-none text-dark"
                        >

                            <div className="admin-stat-card">

                                <i
                                    className="bi bi-envelope fs-1"
                                    aria-hidden="true"
                                ></i>

                                <h3 className="h4 mt-3">
                                    Messages
                                </h3>

                                <p className="text-muted mb-0">
                                    View customer messages.
                                </p>

                            </div>

                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;