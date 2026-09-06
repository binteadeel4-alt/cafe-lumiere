import { Link, useParams } from "react-router-dom";

function OrderSuccess() {
    const { orderId } = useParams();

    return (
        <main className="order-success-page">

            <div className="container py-5">

                <div className="row justify-content-center">

                    <div className="col-md-7 col-lg-6">

                        <div className="card border-0 shadow-sm text-center">

                            <div className="card-body p-5">

                                <div className="mb-4">
                                    <i
                                        className="bi bi-check-circle-fill text-success"
                                        style={{ fontSize: "70px" }}
                                    ></i>
                                </div>

                                <h1 className="fw-bold mb-3">
                                    Order Placed!
                                </h1>

                                <p className="text-muted mb-4">
                                    Thank you for ordering from Cafe Lumiere.
                                    Your order has been received successfully.
                                </p>

                                <div className="bg-light rounded p-3 mb-4">

                                    <p className="text-muted mb-1">
                                        Your Order Number
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        #{orderId}
                                    </h2>

                                </div>

                                <p className="text-muted">
                                    Your order is currently{" "}
                                    <strong>pending</strong>.
                                    We'll start preparing it soon.
                                </p>

                                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center mt-4">

                                    <Link
                                        to="/menu"
                                        className="btn btn-dark rounded-pill px-4"
                                    >
                                        Order Again
                                    </Link>

                                    <Link
                                        to="/"
                                        className="btn btn-outline-dark rounded-pill px-4"
                                    >
                                        Back to Home
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default OrderSuccess;