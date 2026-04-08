// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Corporate from './pages/Corporate';
import AboutUs from './pages/AboutUs';
import Manufacturing from './pages/Manufacturing';
import Catalogues from './pages/Catalogues';
import Environments from './pages/Environments';
import Guides from './pages/Guides';
import ContactUs from './pages/ContactUs';
import Furniture from './pages/Furniture';
import Architecture from './pages/Architecture';
import DigitalInfra from './pages/DigitalInfra';
import Libraries from './pages/Libraries';
import SchoolDesigns from './pages/SchoolDesigns';
import Sports from './pages/Sports';
import Mathematics from './pages/Mathematics';
import Science from './pages/Science';
import LabsLibraries from './pages/LabsLibraries';
import Registration from './pages/Registration';
import Login from './pages/Login';
import SchoolSale from './pages/SchoolSale';
import Partnerships from './pages/Partnerships';
import SetupGuide from './pages/SetupGuide';
import Workshops from './pages/Workshops';
import Fundraising from './pages/Fundraising';
import GenericInnerPage from './pages/GenericInnerPage';
import DigitizationGuide from './pages/DigitizationGuide';
import SetupSchoolIndia from './pages/SetupSchoolIndia';
import ProductCatalog2025 from './pages/ProductCatalog2025';
import SkillLabGuide from './pages/SkillLabGuide';
import PlayFurnitureLookbook from './pages/PlayFurnitureLookbook';
import MathResources from './pages/MathResources';
import CompletedProjects from './pages/CompletedProjects';
import SchoolDesignIdeas from './pages/SchoolDesignIdeas';
import LibraryTrends from './pages/LibraryTrends';
import JobOpenings from './pages/JobOpenings';
import Influencers from './pages/Influencers';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CMSEditor from './pages/admin/CMSEditor';
import ProductManager from './pages/admin/ProductManager';
import QuotesInbox from './pages/admin/QuotesInbox';
import ContactsInbox from './pages/admin/ContactsInbox';

const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <div className="flex-grow">
      <Outlet />
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Main Application Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/manufacturing" element={<Manufacturing />} />
            <Route path="/catalogues" element={<Catalogues />} />
            <Route path="/environments" element={<Environments />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/furniture" element={<Furniture />} />
            <Route path="/school-building-design" element={<Architecture />} />
            <Route path="/digital" element={<DigitalInfra />} />
            <Route path="/libraries" element={<Libraries />} />
            <Route path="/design" element={<SchoolDesigns />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/gamified-math-labs" element={<Mathematics />} />
            <Route path="/science-is-fun" element={<Science />} />
            <Route path="/labs" element={<LabsLibraries />} />
            <Route path="/registration-new-form" element={<Registration />} />
            <Route path="/my-account" element={<Login />} />
            <Route path="/school-sale" element={<SchoolSale />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/setup-guide" element={<SetupGuide />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/fundraising" element={<Fundraising />} />
            {/* Resource Hub Routes */}
            <Route path="/p/digitization-guide" element={<DigitizationGuide />} />
            <Route path="/p/setup-school-india" element={<SetupSchoolIndia />} />
            <Route path="/p/product-catalog-2025" element={<ProductCatalog2025 />} />
            <Route path="/p/skill-lab-guide" element={<SkillLabGuide />} />
            <Route path="/p/play-furniture-lookbook" element={<PlayFurnitureLookbook />} />
            <Route path="/p/gamified-math-resources" element={<MathResources />} />
            <Route path="/p/completed-projects" element={<CompletedProjects />} />
            <Route path="/p/school-design-ideas" element={<SchoolDesignIdeas />} />
            <Route path="/p/library-trends" element={<LibraryTrends />} />
            <Route path="/p/job-openings" element={<JobOpenings />} />
            <Route path="/p/influencers" element={<Influencers />} />
            <Route path="/p/:slug" element={<GenericInnerPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="cms" element={<CMSEditor />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="quotes" element={<QuotesInbox />} />
            <Route path="contacts" element={<ContactsInbox />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
