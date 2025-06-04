import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/home.page'
import ExplorePage from './pages/explore.page'
import CreateListingPage from './pages/create-listing.page'
import FreelancePage from './pages/freelance.page'
import JobsPage from './pages/jobs.page'
import MyListing from './pages/my-listings.page'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
            <Route path="/freelance" element={<FreelancePage />} />
            <Route path="/my-listing" element={<MyListing />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="*" element={<div className="py-20 text-center text-white">Page not found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
