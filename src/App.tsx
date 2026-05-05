import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KaraokeRoom } from './components/KaraokeRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KaraokeRoom />} />
        <Route path="/room/:sessionId" element={<KaraokeRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
