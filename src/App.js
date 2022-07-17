import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "./components/Home/Home"
import FigmaDesigns from "./components/FigmaDesigns"


function App() {

  
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/figma-designs" element={<FigmaDesigns />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
