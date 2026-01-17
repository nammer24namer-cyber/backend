import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GuestPage } from './pages/GuestPage';

import { StaffPage } from './pages/StaffPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GuestPage />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/staff" element={<StaffPage />} />
      </Routes>
    </Router>
  );
}

export default App;
