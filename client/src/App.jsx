import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/msal";
import { PublicClientApplication } from "@azure/msal-browser";
import './index.css';

import { ProtectedRoute } from './components/ProtectedRoute';

const msalInstance = new PublicClientApplication(msalConfig);

import Dashboard from './pages/Dashboard';
import MovementForm from './pages/MovementForm';

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ProtectedRoute>
        <Router>
          <div className="layout">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/nuevo" element={<MovementForm />} />
            </Routes>
          </div>
        </Router>
      </ProtectedRoute>
    </MsalProvider>
  );
}

export default App;
