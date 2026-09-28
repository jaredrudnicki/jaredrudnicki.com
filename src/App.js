import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import HomeV2 from "./components/Home/HomeV2"
import ProjectsPage, { ProjectRedirect } from "./components/Project/ProjectsPage"
import WritingPage from "./components/Writing/WritingPage"
import ExperiencePage from "./components/Experience/ExperiencePage"
import PostPage from "./components/Writing/PostPage"
import FigmaDesigns from "./components/FigmaDesigns"
import Pages from "./components/MarkdownLinks"
import MarkdownPage from "./components/MarkdownPage"

// MD FILES
import best_laptops_2022_MD from "./components/MarkdownFiles/best_laptops_2022.md"



function App() {

  
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<HomeV2 />} />
      <Route path="/experience" element={<ExperiencePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectRedirect />} />
      <Route path="/writing" element={<WritingPage />} />
      <Route path="/writing/:slug" element={<PostPage />} />
      <Route path="/figma-designs" element={<FigmaDesigns />} />
      <Route path="/reviews" element={<Pages />} />
      <Route path="/reviews/best_laptops_2022" element={
        <MarkdownPage file={best_laptops_2022_MD}/>
      }></Route>    </Routes>
    </BrowserRouter>
  );
}

export default App;
