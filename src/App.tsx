import { Route, Routes } from 'react-router-dom'

import { CustomCursor, PageTransition, useSmoothScroll } from './motion'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Project from './pages/Project'
import Work from './pages/Work'
import { LocalizationProvider } from './i18n/localization'

export default function App() {
  useSmoothScroll()

  return (
    <LocalizationProvider>
      <PageTransition>
        {(location) => (
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/work/:slug" element={<Project />} />
            <Route path="/ar" element={<Home />} />
            <Route path="/ar/work" element={<Work />} />
            <Route path="/ar/about" element={<About />} />
            <Route path="/ar/contact" element={<Contact />} />
            <Route path="/ar/work/:slug" element={<Project />} />
          </Routes>
        )}
      </PageTransition>

      {/* Sibling of the route tree, so it survives every navigation. */}
      <CustomCursor />
    </LocalizationProvider>
  )
}
