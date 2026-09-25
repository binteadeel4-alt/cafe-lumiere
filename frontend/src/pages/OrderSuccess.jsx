import { Link, useLocation, useParams } from "react-router-dom";
import { CAFE_INFO } from "../config";

function OrderSuccess() {
    const { orderId } = useParams();
    const location = useLocation();

    const order = location.state?.order;

    return (
        <main className="order-success-page">

            <div className="container py-5">

                <div className="row justify-content-center">

                    <div className="col-md-8 col-lg-7">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4 p-md-5">

                                <div className="text-center">

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
                                        Thank you for ordering from{" "}
                                        {CAFE_INFO.name}.
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

                                </div>

                                {order ? (

                                    <>
                                        <div className="border rounded p-4 mb-4">

                                            <div className="d-flex justify-content-between mb-3">

                                                <span className="text-muted">
                                                    Status
                                                </span>

                                                <span className="badge text-bg-warning text-capitalize">
                                                    {order.status}
                                                </span>

                                            </div>

                                            <div className="d-flex justify-content-between">

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

                                        </div>


                                        <h5 className="fw-bold mb-3">
                                            Your Items
                                        </h5>

                                        <div className="mb-4">

                                            {order.items.map((item) => (

                                                <div
                                                    key={item.id}
                                                    className="d-flex justify-content-between align-items-center border-bottom py-3"
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

                                        </div>


                                        <div className="bg-light rounded p-3 mb-4">

                                            <h6 className="fw-bold mb-2">
                                                Customer
                                            </h6>

                                            <p className="mb-1">
                                                {order.customer_name}
                                            </p>

                                            <p className="text-muted mb-0">
                                                {order.customer_phone}
                                            </p>

                                        </div>

                                    </>

                                ) : (

                                    <div className="alert alert-info text-center">
                                        Your order was placed successfully.
                                        Your order number is{" "}
                                        <strong>#{orderId}</strong>.
                                    </div>

                                )}

                                <p className="text-muted text-center mb-4">
                                    We'll start preparing your order soon.
                                </p>

                                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">

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