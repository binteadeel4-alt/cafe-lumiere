import { useEffect, useState } from "react";
import axios from "axios";

import MenuCard from "../components/MenuCard";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/menu`
                );

                setMenuItems(response.data?.items || []);
            } catch (error) {
                console.error("MENU ERROR:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load the menu."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    return (
        <main className="menu-page">

            <section className="menu-header">
                <div className="container text-center">
                    <p className="hero-subtitle">
                        OUR MENU
                    </p>

                    <h1 className="display-3 fw-bold">
                        Something for every mood.
                    </h1>

                    <p className="text-muted mx-auto menu-intro">
                        From freshly brewed coffee to delicious desserts,
                        discover something you'll love.
                    </p>
                </div>
            </section>

            <section className="pb-5">
                <div className="container">

                    {/* LOADING */}

                    {loading && (
                        <div className="text-center py-5">

                            <div
                                className="spinner-border"
                                role="status"
                                aria-label="Loading menu"
                            >
                                <span className="visually-hidden">
                                    Loading menu...
                                </span>
                            </div>

                            <p className="text-muted mt-3">
                                Loading menu...
                            </p>

                        </div>
                    )}

                    {/* ERROR */}

                    {!loading && error && (
                        <div
                            className="alert alert-danger text-center"
                            role="alert"
                            aria-live="assertive"
                        >
                            {error}
                        </div>
                    )}

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        menuItems.length === 0 && (
                            <div className="text-center py-5">

                                <i
                                    className="bi bi-cup-hot fs-1"
                                    aria-hidden="true"
                                ></i>

                                <h2 className="fw-bold mt-3 h4">
                                    Menu coming soon
                                </h2>

                                <p className="text-muted">
                                    We're preparing something delicious
                                    for you.
                                </p>

                            </div>
                        )}

                    {/* MENU ITEMS */}

                    {!loading &&
                        !error &&
                        menuItems.length > 0 && (
                            <div className="row">

                                {menuItems.map((item) => (
                                    <MenuCard
                                        key={item.id}
                                        item={item}
                                        onAddToCart={addToCart}
                                    />
                                ))}

                            </div>
                        )}

                </div>
            </section>

        </main>
    );
}

export default Menu;

