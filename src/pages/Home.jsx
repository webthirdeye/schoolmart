import BannerSection from '../components/BannerSection';
import ResourceTiles from '../components/ResourceTiles';
import CTASection from '../components/CTASection';
import ClientLogos from '../components/ClientLogos';
import { useCMSPage } from '../hooks/useCMSBlock';

const Home = () => {
  return (
    <main className="min-h-screen space-y-0 pb-4">
      {/* Promotional Banner */}
      <BannerSection />

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
