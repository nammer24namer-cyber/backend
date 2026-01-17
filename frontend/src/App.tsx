import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GuestPage } from './pages/GuestPage';

import { StaffPage } from './pages/StaffPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestPage />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/staff" element={<StaffPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
