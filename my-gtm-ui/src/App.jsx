// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import LandingPage from './pages/LandingPage';
import Layout from './layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import Personalization from './pages/Personalization';
import ActivityLog from './pages/ActivityLog';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Help from './pages/Help';
import VerifyEmail from './pages/VerifyEmail';
import Outreach from './pages/Outreach';
import EmailConfirmation from './pages/EmailConfirmation';
import MessageBoard from './pages/MessageBoard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Integrations from './components/Integrations';
import Product from './pages/Product';
import Solutions from './components/Solutions';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  console.log('✅ App component rendered'); //
  return (
    <div className="min-h-screen bg-background text-white">
      <ToastContainer 
      position="top-right" 
      autoClose={1000}
      newestOnTop
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme='dark'  />
      <Router>
        <Routes>
          {/* Landing page (no sidebar/header) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/product" element={<Product />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfAuthenticated>
                <Signup />
              </RedirectIfAuthenticated>
            }
          />

          {/* Protected routes with sidebar/header */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/messages" element={<MessageBoard />} />
            <Route path="/personalization" element={<Personalization />} />
            <Route path="/activity-log" element={<ActivityLog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />



          </Route>

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;