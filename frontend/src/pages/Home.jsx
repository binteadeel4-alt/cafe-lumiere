import Hero from "../components/Hero";
import FeaturedMenu from "../components/FeaturedMenu";
import AboutPreview from "../components/AboutPreview";
import GalleryPreview from "../components/GalleryPreview";
import ReviewsPreview from "../components/ReviewsPreview";
import VisitSection from "../components/VisitSection";

function Home() {
    return (
        <>
            <Hero />
            <FeaturedMenu />
            <AboutPreview />
            <GalleryPreview />
            <ReviewsPreview />
            <VisitSection />
        </>
    );
}

export default Home;