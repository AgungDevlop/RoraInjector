import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PlayVideo } from './PlayVideo'; // Adjust path according to your project structure

const PlayApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<PlayVideo />} />
        <Route path="/e/:id" element={<PlayVideo />} />
      </Routes>
    </BrowserRouter>
  );
};

const rootElement = document.getElementById('play-root');
if (rootElement) {
  createRoot(rootElement).render(<PlayApp />);
}
