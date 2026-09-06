
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Gallery() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchGallery = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:5000/api/gallery"
                );

                setItems(response.data.items || []);

            } catch (error) {

                console.error(
                    "GALLERY ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load the gallery."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchGallery();

    }, []);


    return (
        <main className="gallery-page">

            {/* HEADER */}

            <section className="py-5 bg-light">

                <div className="container py-lg-5 text-center">

                    <p className="hero-subtitle">
                        OUR GALLERY
                    </p>

                    <h1 className="display-3 fw-bold mb-3">
                        A taste of Café Lumière.
                    </h1>

                    <p
                        className="text-muted mx-auto"
                        style={{ maxWidth: "700px" }}
                    >
                        Take a look inside Café Lumière
                        and experience the atmosphere,
                        spaces, and moments that make us special.
                    </p>

                </div>

            </section>


            {/* GALLERY */}

            <section className="py-5">

                <div className="container py-lg-4">

                    {/* LOADING */}

                    {loading && (

                        <div className="text-center py-5">

                            <div
                                className="spinner-border"
                                role="status"
                            />

                            <p className="text-muted mt-3">
                                Loading gallery...
                            </p>

                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div className="alert alert-danger text-center">
                            {error}
                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        items.length === 0 && (

                            <div className="text-center py-5">

                                <i className="bi bi-images fs-1"></i>

                                <h4 className="fw-bold mt-3">
                                    Gallery coming soon
                                </h4>

                                <p className="text-muted">
                                    We're preparing some beautiful
                                    moments from Café Lumière.
                                </p>

                            </div>

                        )}


                    {/* GALLERY ITEMS */}

                    {!loading &&
                        !error &&
                        items.length > 0 && (

                            <div className="row g-4">

                                {items.map((item) => (

                                    <div
                                        className="col-12 col-sm-6 col-lg-4"
                                        key={item.id}
                                    >

                                        <div className="card border-0 shadow-sm h-100 overflow-hidden">

                                            {/* IMAGE */}

                                            {item.image && (

                                                <img
                                                    src={`http://localhost:5000${item.image}`}
                                                    alt={item.title}
                                                    className="w-100"
                                                    style={{
                                                        height: "320px",
                                                        objectFit: "cover"
                                                    }}
                                                />

                                            )}


                                            {/* VIDEO */}

                                            {
                                                item.video && (

                                                    <video
                                                        src={`http://localhost:5000${item.video}`}
                                                        className="w-100"
                                                        style={{
                                                            height: "320px",
                                                            objectFit: "cover"
                                                        }}
                                                        controls
                                                        preload="metadata"
                                                    />

                                                )
                                            }


                                            {/* INFO */}

                                            <div className="card-body p-4">

                                                <h5 className="fw-bold mb-2">
                                                    {item.title}
                                                </h5>

                                                {item.description && (

                                                    <p className="text-muted mb-0">
                                                        {item.description}
                                                    </p>

                                                )}

                                            </div>

                                        </div >

                                    </div >

                                ))}

                            </div >

                        )}

                </div >

            </section >


            {/* CTA */}

            < section className="py-5 bg-light" >

                <div className="container text-center py-4">

                    <h2 className="fw-bold">
                        Come experience it yourself.
                    </h2>

                    <p className="text-muted">
                        Visit Café Lumière and become part
                        of our story.
                    </p>

                    <Link
                        to="/menu"
                        className="btn btn-dark rounded-pill px-4"
                    >
                        Explore Menu
                        <i className="bi bi-arrow-right ms-2"></i>
                    </Link>

                </div>

            </section >

        </main >
    );
}

export default Gallery;

