function MenuCard({ item, onAddToCart }) {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card menu-card h-100 shadow-sm border-0">

                <img
                    src={`http://localhost:5000${item.image}`}
                    className="card-img-top menu-card-image"
                    alt={item.name}
                />

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-start mb-2">

                        <h5 className="card-title fw-bold mb-0">
                            {item.name}
                        </h5>

                        <span className="fw-bold">
                            KD {item.price}
                        </span>

                    </div>

                    <p className="text-muted mb-3">
                        {item.description}
                    </p>

                    <button
                        className="btn btn-dark w-100 rounded-pill"
                        onClick={() => onAddToCart(item)}
                    >
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                    </button>

                </div>

            </div>
        </div>
    );
}

export default MenuCard;