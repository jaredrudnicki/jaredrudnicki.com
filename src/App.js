import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "./components/Home/Home"
import FigmaDesigns from "./components/FigmaDesigns"
import Pages from "./components/MarkdownLinks"
import MarkdownPage from "./components/MarkdownPage"

// MD FILES
import best_laptops_2022_MD from "./components/MarkdownFiles/best_laptops_2022.md"


function App() {

  
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/figma-designs" element={<FigmaDesigns />} />
      <Route path="/reviews" element={<Pages />} />
      <Route path="/reviews/best_laptops_2022" element={
        <MarkdownPage file={best_laptops_2022_MD}/>
      }></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
