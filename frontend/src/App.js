import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import HealthInfo from './pages/HealthInfo';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/health-info" element={<HealthInfo />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 