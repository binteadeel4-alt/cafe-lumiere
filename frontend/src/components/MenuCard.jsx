import { API_URL } from "../config";

function MenuCard({ item, onAddToCart }) {

    const fallbackImage =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999999' font-size='32' font-family='Arial'%3EImage unavailable%3C/text%3E%3C/svg%3E";

    const imageUrl = item.image
        ? `${API_URL}${item.image}`
        : fallbackImage;

    return (
        <div className="col-md-6 col-lg-4 mb-4">

            <div className="card menu-card h-100 shadow-sm border-0">

                <img
                    src={imageUrl}
                    className="card-img-top menu-card-image"
                    alt={item.name || "Menu item"}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage;
                    }}
                    loading="lazy"
                />

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-start mb-2">

                        <h5 className="card-title fw-bold mb-0">
                            {item.name}
                        </h5>

                        <span className="fw-bold">
                            KD {Number(item.price).toFixed(3)}
                        </span>

                    </div>

                    <p className="text-muted mb-3">
                        {item.description}
                    </p>

                    <button
                        className="btn btn-dark w-100 rounded-pill"
                        onClick={() => onAddToCart(item)}
                    >
                        <i
                            className="bi bi-cart-plus me-2"
                            aria-hidden="true"
                        ></i>
                        Add to Cart
                    </button>

                </div>

            </div>

        </div>
    );
}

export default MenuCard;

