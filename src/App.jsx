import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import QuotesPage from './pages/QuotesPage';
import RewardsPage from './pages/RewardsPage';
import PenaltiesPage from './pages/PenaltiesPage';
import AddActivityPage from './pages/AddActivityPage';

function App() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quotes" element={<QuotesPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/penalties" element={<PenaltiesPage />} />
          <Route path="/add-activity" element={<AddActivityPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
