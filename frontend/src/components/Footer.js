import React from 'react';

export const Footer = () => (
  <footer className="bg-gray-800 text-white py-8">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center mb-4">
            <i className="fas fa-chart-line text-teal-400 mr-2 text-xl"></i>
            <span className="text-xl font-bold">SaaS<span className="text-teal-400">Val</span></span>
          </div>
          <p className="text-gray-400">
            The most accurate SaaS business valuation tool for founders, investors, and acquirers.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#valuation" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Valuation Tool</a></li>
            <li><a href="#features" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Features</a></li>
            <li><a href="#how-it-works" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">How It Works</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Blog</a></li>
            <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">SaaS Valuation Guide</a></li>
            <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Case Studies</a></li>
            <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">FAQ</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4">Connect</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-xl">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-xl">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            Professional SaaS valuations made simple
          </p>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-700 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2025 SaaSVal. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm">Support</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;