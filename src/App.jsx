// src/App.jsx - Build v1.0.1 (Cache Purge)
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
import EnvironmentPost from './pages/EnvironmentPost';
import Guides from './pages/Guides';
import GuidePost from './pages/GuidePost';
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
import MemberDashboard from './pages/MemberDashboard';
import Registration from './pages/Registration';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import SchoolSale from './pages/SchoolSale';
import Partnerships from './pages/Partnerships';
import SetupGuide from './pages/SetupGuide';
import Workshops from './pages/Workshops';
import Fundraising from './pages/Fundraising';
import ResourcePost from './pages/ResourcePost';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import ShippingPolicy from './pages/ShippingPolicy';
import CancellationPolicy from './pages/CancellationPolicy';
import Returns from './pages/Returns';
import Payments from './pages/Payments';
import SellerHelp from './pages/SellerHelp';
import SellOnSchoolmart from './pages/SellOnSchoolmart';
import OrderRejectionPolicy from './pages/OrderRejectionPolicy';
import ReportIssue from './pages/ReportIssue';
import Blog from './pages/Blog';
import DeliveryLocations from './pages/DeliveryLocations';
import ProductPost from './pages/ProductPost';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CMSEditor from './pages/admin/CMSEditor';
import ProductManager from './pages/admin/ProductManager';
import QuotesInbox from './pages/admin/QuotesInbox';
import ContactsInbox from './pages/admin/ContactsInbox';
import FormConfigEditor from './pages/admin/FormConfigEditor';
import UserManager from './pages/admin/UserManager';
import GlobalSettings from './pages/admin/GlobalSettings';

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
            <Route path="/environments/:slug" element={<EnvironmentPost />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:slug" element={<GuidePost />} />
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
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/my-account" element={<Login />} />
            <Route path="/member/dashboard" element={<MemberDashboard />} />
            <Route path="/school-sale" element={<SchoolSale />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/setup-guide" element={<SetupGuide />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/fundraising" element={<Fundraising />} />
            
            {/* Dedicated Footer Pages (Separated from Resource Hub) */}
            <Route path="/p/how-it-works" element={<HowItWorks />} />
            <Route path="/p/sell-on-schoolmart" element={<SellOnSchoolmart />} />
            <Route path="/p/pricing" element={<Pricing />} />
            <Route path="/p/seller-help" element={<SellerHelp />} />
            <Route path="/p/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/p/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/p/replacement-return" element={<Returns />} />
            <Route path="/p/order-rejection-policy" element={<OrderRejectionPolicy />} />
            <Route path="/p/payments" element={<Payments />} />
            <Route path="/p/payment-policy" element={<Payments />} />
            <Route path="/p/report-issue" element={<ReportIssue />} />
            <Route path="/p/blog" element={<Blog />} />
            <Route path="/p/delivery-locations" element={<DeliveryLocations />} />
            
            {/* Unified Dynamic Resource Hub Routes */}
            <Route path="/p/:slug" element={<ResourcePost />} />
            <Route path="/resource/:slug" element={<ResourcePost />} />
            <Route path="/product/:slug" element={<ProductPost />} />
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
            <Route path="form-config/:slug" element={<FormConfigEditor />} />
            <Route path="users" element={<UserManager />} />
            <Route path="settings" element={<GlobalSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
