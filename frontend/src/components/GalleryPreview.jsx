import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function GalleryPreview() {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/gallery`);

                const items =
                    response.data?.items ||
                    response.data?.gallery ||
                    response.data ||
                    [];

                setGalleryItems(Array.isArray(items) ? items.slice(0, 4) : []);
            } catch (err) {
                console.error("Failed to load gallery:", err);
                setError("Unable to load gallery right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    const getMediaUrl = (path) => {
        if (!path) return "";

        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        return `${API_URL}${path}`;
    };

    return (
        <section className="gallery-preview py-5">
            <div className="container py-lg-5">

                <div className="text-center mb-5">
                    <p className="hero-subtitle">
                        OUR SPACE
                    </p>

                    <h2 className="display-5 fw-bold">
                        A place to slow down.
                    </h2>

                    <p className="text-muted mx-auto section-intro">
                        Come for the coffee, stay for the atmosphere.
                    </p>
                </div>


                {loading && (
                    <div className="text-center py-4">
                        <div
                            className="spinner-border"
                            role="status"
                            aria-label="Loading gallery"
                        >
                            <span className="visually-hidden">
                                Loading gallery...
                            </span>
                        </div>
                    </div>
                )}


                {!loading && error && (
                    <div className="text-center text-muted py-4">
                        {error}
                    </div>
                )}


                {!loading && !error && galleryItems.length === 0 && (
                    <div className="text-center text-muted py-4">
                        No gallery items available yet.
                    </div>
                )}


                {!loading && !error && galleryItems.length > 0 && (
                    <div className="row g-3">

                        {galleryItems.map((item) => {
                            const isVideo =
                                item.video ||
                                item.media_type === "video";

                            const mediaPath =
                                isVideo ? item.video : item.image;

                            return (
                                <div
                                    className="col-6 col-lg-3"
                                    key={item.id}
                                >
                                    <div className="gallery-item">

                                        {isVideo ? (
                                            <video
                                                src={getMediaUrl(mediaPath)}
                                                className="gallery-image"
                                                controls
                                                muted
                                                playsInline
                                                preload="metadata"
                                                aria-label={
                                                    item.title ||
                                                    "Café Lumière gallery video"
                                                }
                                            />
                                        ) : (
                                            <img
                                                src={getMediaUrl(mediaPath)}
                                                alt={
                                                    item.title ||
                                                    "Café Lumière"
                                                }
                                                className="gallery-image"
                                                loading="lazy"
                                                onError={(event) => {
                                                    event.currentTarget.src =
                                                        "/src/assets/hero.png";
                                                }}
                                            />
                                        )}

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </section>
    );
}

export default GalleryPreview;