import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import HowItWorks from '../components/landing/HowItWorks';
import CtaBanner from '../components/landing/CtaBanner';
import Footer from '../components/landing/Footer';

function LandingPage() {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <StatsSection />
            <HowItWorks />
            <CtaBanner />
            <Footer />
        </div>
    );
}

export default LandingPage;