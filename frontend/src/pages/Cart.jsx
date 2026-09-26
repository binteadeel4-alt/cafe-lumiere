import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";

function Cart() {
    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        totalPrice
    } = useCart();

    if (cart.length === 0) {
        return (
            <main className="cart-page">

                <div className="container py-5">

                    <div className="text-center py-5">

                        <i
                            className="bi bi-cart-x display-1 text-muted"
                            aria-hidden="true"
                        ></i>

                        <h1 className="fw-bold mt-4">
                            Your cart is empty
                        </h1>

                        <p className="text-muted">
                            Looks like you haven't added anything yet.
                        </p>

                        <Link
                            to="/menu"
                            className="btn btn-dark rounded-pill px-4 mt-3"
                        >
                            Browse Menu
                        </Link>

                    </div>

                </div>

            </main>
        );
    }

    return (
        <main className="cart-page">

            <div className="container py-5">

                <div className="mb-5">

                    <p className="hero-subtitle">
                        YOUR ORDER
                    </p>

                    <h1 className="display-5 fw-bold">
                        Your Cart
                    </h1>

                </div>

                <div className="row g-4">

                    {/* CART ITEMS */}

                    <div className="col-lg-8">

                        {cart.map((item) => (

                            <div
                                key={item.id}
                                className="card border-0 shadow-sm mb-3"
                            >

                                <div className="card-body p-3">

                                    <div className="row align-items-center">

                                        {/* IMAGE */}

                                        <div className="col-3 col-md-2">

                                            <img
                                                src={`${API_URL}${item.image} `}
                                                alt={item.name}
                                                className="img-fluid rounded"
                                            />

                                        </div>


                                        {/* NAME */}

                                        <div className="col-9 col-md-4">

                                            <h2 className="fw-bold mb-1 h5">
                                                {item.name}
                                            </h2>

                                            <p className="text-muted mb-0">
                                                KD {Number(item.price).toFixed(3)}
                                            </p>

                                        </div>


                                        {/* QUANTITY */}

                                        <div className="col-7 col-md-3 mt-3 mt-md-0">

                                            <div className="d-flex align-items-center">

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() =>
                                                        decreaseQuantity(item.id)
                                                    }
                                                    aria-label={`Decrease quantity of ${item.name} `}
                                                >
                                                    <i
                                                        className="bi bi-dash"
                                                        aria-hidden="true"
                                                    ></i>
                                                </button>

                                                <span
                                                    className="mx-3 fw-bold"
                                                    aria-label={`Quantity: ${item.quantity} `}
                                                >
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() =>
                                                        increaseQuantity(item.id)
                                                    }
                                                    aria-label={`Increase quantity of ${item.name} `}
                                                >
                                                    <i
                                                        className="bi bi-plus"
                                                        aria-hidden="true"
                                                    ></i>
                                                </button>

                                            </div>

                                        </div>


                                        {/* PRICE */}

                                        <div className="col-4 col-md-2 text-end mt-3 mt-md-0">

                                            <strong>
                                                KD{" "}
                                                {(
                                                    Number(item.price) *
                                                    item.quantity
                                                ).toFixed(3)}
                                            </strong>

                                        </div>


                                        {/* DELETE */}

                                        <div className="col-1 text-end mt-3 mt-md-0">

                                            <button
                                                type="button"
                                                className="btn btn-link text-danger p-0"
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                                aria-label={`Remove ${item.name} from cart`}
                                            >
                                                <i
                                                    className="bi bi-trash fs-5"
                                                    aria-hidden="true"
                                                ></i>
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                        <Link
                            to="/menu"
                            className="btn btn-outline-dark rounded-pill mt-2"
                        >
                            <i
                                className="bi bi-arrow-left me-2"
                                aria-hidden="true"
                            ></i>
                            Continue Shopping
                        </Link>

                    </div>


                    {/* SUMMARY */}

                    <div className="col-lg-4">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <h2 className="fw-bold mb-4 h4">
                                    Order Summary
                                </h2>

                                <div className="d-flex justify-content-between mb-3">

                                    <span>
                                        Items
                                    </span>

                                    <span>
                                        {cart.reduce(
                                            (total, item) =>
                                                total + item.quantity,
                                            0
                                        )}
                                    </span>

                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-4">

                                    <strong>
                                        Total
                                    </strong>

                                    <strong>
                                        KD {totalPrice.toFixed(3)}
                                    </strong>

                                </div>

                                <Link
                                    to="/checkout"
                                    className="btn btn-dark w-100 rounded-pill"
                                >
                                    Proceed to Checkout

                                    <i
                                        className="bi bi-arrow-right ms-2"
                                        aria-hidden="true"
                                    ></i>
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default Cart;

