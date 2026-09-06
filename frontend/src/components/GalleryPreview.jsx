import heroImage from "../assets/hero.png";

function GalleryPreview() {
    const images = [
        {
            src: heroImage,
            alt: "Café interior"
        },
        {
            src: heroImage,
            alt: "Fresh coffee"
        },
        {
            src: heroImage,
            alt: "Café atmosphere"
        },
        {
            src: heroImage,
            alt: "Dessert"
        }
    ];

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

                <div className="row g-3">
                    {images.map((image, index) => (
                        <div
                            className="col-6 col-lg-3"
                            key={index}
                        >
                            <div className="gallery-item">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="gallery-image"
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default GalleryPreview;