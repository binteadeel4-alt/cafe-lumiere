import { useEffect, useState } from "react";
import axios from "axios";

import MenuCard from "../components/MenuCard";
import { useCart } from "../context/CartContext";

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get(
                    "https://cafe-lumiere-production.up.railway.app/api/menu"
                );

                setMenuItems(response.data.items);
            } catch (error) {
                console.error(error);
                setError("Unable to load the menu.");
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

                    {loading && (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger text-center">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
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