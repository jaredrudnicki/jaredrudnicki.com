import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'
import Home from "./components/Home/Home"
import FigmaDesigns from "./components/FigmaDesigns"


function App() {

  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/figma-designs" element={<FigmaDesigns />} />
    </Routes>
      

      <div className="App">
        <Home />
      </div>
    </BrowserRouter>
  );
}

export default App;
