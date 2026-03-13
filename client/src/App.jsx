import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react";
import { ThemeProvider } from "./config/ThemeContext";
import { msalConfig } from "./config/msal";
import { PublicClientApplication } from "@azure/msal-browser";
import './index.css';

import { ProtectedRoute } from './components/ProtectedRoute';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './config/AuthContext';

const msalInstance = new PublicClientApplication(msalConfig);
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

import Layout from './components/Layout';
import MovementForm from './pages/MovementForm';
import Settings from './pages/Settings';
import StatusPage from './pages/StatusPage';
import MisSolicitudes from './pages/MisSolicitudes';
import PorteriaGuard from './pages/porteria/PorteriaGuard';
import PendientesDia from './pages/porteria/PendientesDia';
import Historial from './pages/porteria/Historial';
import Reglamento from './pages/Reglamento';

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <ThemeProvider>
            <ProtectedRoute>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<MovementForm />} />
                    <Route path="/nuevo" element={<MovementForm />} />
                    <Route path="/status" element={<StatusPage />} />
                    <Route path="/configuracion" element={<Settings />} />
                    <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
                    <Route path="/reglamento" element={<Reglamento />} />
                    <Route path="/porteria" element={
                      <PorteriaGuard>{porteria => <PendientesDia porteria={porteria} />}</PorteriaGuard>
                    } />
                    <Route path="/porteria/historial" element={
                      <PorteriaGuard>{porteria => <Historial porteria={porteria} />}</PorteriaGuard>
                    } />
                  </Routes>
                </Layout>
              </Router>
            </ProtectedRoute>
          </ThemeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </MsalProvider>
  );
}

export default App;
