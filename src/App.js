import React from 'react';
import { useState } from 'react';
import './App.css';
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
        <Link to="/home">
          <button>HOME</button>
        </Link>
      </div>
    </BrowserRouter>
  );
}

export default App;
