// src/pages/Home.jsx
import BannerSection from '../components/BannerSection';
import ResourceTiles from '../components/ResourceTiles';
import CTASection from '../components/CTASection';
import ClientLogos from '../components/ClientLogos';

const Home = () => {
  return (
    <main className="min-h-screen space-y-0 pb-4">
      {/* Promotional Banner */}
      <div className="py-2">
        <BannerSection />
      </div>

      {/* Main Grid & Content Area (Now contains Carousel) */}
      <ResourceTiles />

      {/* CTA Section - Ready to Talk */}
      <CTASection />

      {/* Client Logos */}
      <ClientLogos />
    </main>
  );
};

export default Home;
