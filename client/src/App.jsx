import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react";
import { ThemeProvider } from "./config/ThemeContext";
import { msalConfig } from "./config/msal";
import { PublicClientApplication } from "@azure/msal-browser";
import './index.css';

import { ProtectedRoute } from './components/ProtectedRoute';

const msalInstance = new PublicClientApplication(msalConfig);

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MovementForm from './pages/MovementForm';
import Settings from './pages/Settings';
import StatusPage from './pages/StatusPage';

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <ProtectedRoute>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<MovementForm />} />
                <Route path="/nuevo" element={<MovementForm />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/configuracion" element={<Settings />} />
              </Routes>
            </Layout>
          </Router>
        </ProtectedRoute>
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App;
