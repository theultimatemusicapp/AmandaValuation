import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FeaturesSection, HowItWorksSection } from './components/ValuationForm';
import { FreeValuationTool } from './components/FreeValuationTool';
import { ProValuationPage } from './components/ProValuationPage';
import Footer from './components/Footer';
import { 
  EnhancedHeroSection, 
  EnhancedFeaturesSection, 
  TestimonialsSection, 
  PricingSection, 
  AIDataRoomSection, 
  ResourcesSection, 
  CTASection 
} from './components/EnhancedLanding';
import { BlogSection, BlogPage } from './components/BlogSection';
import { BlogPost1, BlogPost2, BlogPost3 } from './components/BlogPosts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'pro', 'blog', 'blog-post-1', etc.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

// Header Component
const Header = ({ mobileMenuOpen, toggleMobileMenu, currentPage, setCurrentPage }) => (
  <header className="bg-gray-800 text-white py-3 sticky top-0 z-50 shadow-lg">
    <div className="container mx-auto px-4 flex justify-between items-center">
      <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
        <i className="fas fa-chart-line text-teal-400 mr-2 text-xl"></i>
        <div className="text-xl font-bold">
          SaaS<span className="text-teal-400">Val</span>
        </div>
      </div>
      <nav className="hidden md:flex space-x-6">
        <a 
          href="#valuation" 
          className="hover:text-teal-400 transition-colors duration-300"
          onClick={() => setCurrentPage('home')}
        >
          Valuation
        </a>
        <a 
          href="#features" 
          className="hover:text-teal-400 transition-colors duration-300"
          onClick={() => setCurrentPage('home')}
        >
          Features
        </a>
        <a 
          href="#pricing" 
          className="hover:text-teal-400 transition-colors duration-300"
          onClick={() => setCurrentPage('home')}
        >
          Pricing
        </a>
        <button 
          onClick={() => setCurrentPage('pro')}
          className="hover:text-teal-400 transition-colors duration-300 bg-teal-600 px-3 py-1 rounded-lg"
        >
          Pro Tool
        </button>
        <button 
          onClick={() => setCurrentPage('blog')}
          className={`hover:text-teal-400 transition-colors duration-300 ${currentPage === 'blog' ? 'text-teal-400' : ''}`}
        >
          Blog
        </button>
      </nav>
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden focus:outline-none"
        aria-label="Toggle Menu"
      >
        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
      </button>
    </div>
    {mobileMenuOpen && (
      <div className="md:hidden px-4 pb-4 bg-gray-700">
        <nav className="flex flex-col space-y-2 mt-3">
          <a 
            href="#valuation" 
            className="block py-2 hover:text-teal-400 transition-colors duration-300"
            onClick={() => { setCurrentPage('home'); toggleMobileMenu(); }}
          >
            Valuation
          </a>
          <a 
            href="#features" 
            className="block py-2 hover:text-teal-400 transition-colors duration-300"
            onClick={() => { setCurrentPage('home'); toggleMobileMenu(); }}
          >
            Features
          </a>
          <a 
            href="#pricing" 
            className="block py-2 hover:text-teal-400 transition-colors duration-300"
            onClick={() => { setCurrentPage('home'); toggleMobileMenu(); }}
          >
            Pricing
          </a>
          <button 
            onClick={() => { setCurrentPage('pro'); toggleMobileMenu(); }}
            className="block py-2 hover:text-teal-400 transition-colors duration-300 text-left bg-teal-600 px-3 rounded-lg"
          >
            Pro Tool
          </button>
          <button 
            onClick={() => { setCurrentPage('blog'); toggleMobileMenu(); }}
            className="block py-2 hover:text-teal-400 transition-colors duration-300 text-left"
          >
            Blog
          </button>
        </nav>
      </div>
    )}
  </header>
);

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'pro', 'blog', 'blog-post-1', etc.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        mobileMenuOpen={mobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      {/* Main Content */}
      <main className="flex-grow">
        {currentPage === 'pro' ? (
          <ProValuationPage setCurrentPage={setCurrentPage} />
        ) : currentPage === 'blog' ? (
          <BlogPage setCurrentPage={setCurrentPage} />
        ) : currentPage === 'blog-post-1' ? (
          <BlogPost1 />
        ) : currentPage === 'blog-post-2' ? (
          <BlogPost2 />
        ) : currentPage === 'blog-post-3' ? (
          <BlogPost3 />
        ) : (
          <>
            {/* Enhanced Hero Section */}
            <EnhancedHeroSection />
            
            {/* Enhanced Features Section */}
            <EnhancedFeaturesSection />
            
            {/* AI Data Room Section */}
            <AIDataRoomSection />
            
            {/* How It Works */}
            <HowItWorksSection />
            
            {/* Free Valuation Tool */}
            <FreeValuationTool setCurrentPage={setCurrentPage} />
            
            {/* Pricing Section */}
            <PricingSection />
            
            {/* Blog Section */}
            <BlogSection setCurrentPage={setCurrentPage} />
            
            {/* Testimonials */}
            <TestimonialsSection />
            
            {/* Resources */}
            <ResourcesSection />
            
            {/* Call to Action */}
            <CTASection />
          </>
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;