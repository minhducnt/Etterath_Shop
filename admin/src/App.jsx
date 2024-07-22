import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { ToastContainer } from './helper/Toastify';
import AppRoutes from './routes/AppRoutes';
import './styles/App.css';
import { GlobalHistory } from './common/components/GlobalHistory';
import ScrollToTop from './common/components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer />
      <GlobalHistory />
      <AppRoutes />
    </Router>
  );
}

export default App;
