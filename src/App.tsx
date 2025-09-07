import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Frames from './pages/Frames';
import FrameDetails from './pages/FrameDetails';
import Sunglasses from './pages/Sunglasses';
import SunglassesDetails from './pages/SunglassesDetails';
// Admin imports
import { AdminProvider } from './contexts/AdminContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import FramesManagement from './pages/admin/frames/FramesManagement';
import FrameForm from './pages/admin/frames/FrameForm';
import SunglassesList from './pages/admin/sunglasses/SunglassesList';
import SunglassesForm from './pages/admin/sunglasses/SunglassesForm';
import CompanySettings from './pages/admin/CompanySettings';
import InquiryManagement from './pages/admin/inquiries/InquiryManagement';
import ContactManagement from './pages/admin/contacts/ContactManagement';

function App() {
  return (
    <AdminProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/about" element={
            <Layout>
              <About />
            </Layout>
          } />
          <Route path="/services" element={
            <Layout>
              <Services />
            </Layout>
          } />
          <Route path="/contact" element={
            <Layout>
              <Contact />
            </Layout>
          } />
          <Route path="/frames" element={
            <Layout>
              <Frames />
            </Layout>
          } />
          <Route path="/frames/:id" element={
            <Layout>
              <FrameDetails />
            </Layout>
          } />
          <Route path="/sunglasses" element={
            <Layout>
              <Sunglasses />
            </Layout>
          } />
          <Route path="/sunglasses/:id" element={
            <Layout>
              <SunglassesDetails />
            </Layout>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/frames" element={
            <ProtectedRoute>
              <AdminLayout>
                <FramesManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/frames/new" element={
            <ProtectedRoute>
              <AdminLayout>
                <FrameForm />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/frames/:id/edit" element={
            <ProtectedRoute>
              <AdminLayout>
                <FrameForm />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/sunglasses" element={
            <ProtectedRoute>
              <AdminLayout>
                <SunglassesList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/sunglasses/new" element={
            <ProtectedRoute>
              <AdminLayout>
                <SunglassesForm />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/sunglasses/:id/edit" element={
            <ProtectedRoute>
              <AdminLayout>
                <SunglassesForm />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/company" element={
            <ProtectedRoute>
              <AdminLayout>
                <CompanySettings />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/inquiries" element={
            <ProtectedRoute>
              <AdminLayout>
                <InquiryManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/contacts" element={
            <ProtectedRoute>
              <AdminLayout>
                <ContactManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
