import React, { useState } from 'react';

// Testimonials Section
export const TestimonialsSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hear from SaaS founders who have used SaaS Valuation App to understand their business worth.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="testimonial-card bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
              EC
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Emily Carter</h3>
              <p className="text-sm text-gray-500">Founder, TechTrend Innovations</p>
            </div>
          </div>
          <div className="flex mb-2">
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
          </div>
          <p className="text-gray-600">
            "SaaS Valuation App gave me a clear picture of my company's value in just 15 minutes. 
            The AI insights were a game-changer for our investor pitch!"
          </p>
        </div>

        <div className="testimonial-card bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              MB
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Michael Brown</h3>
              <p className="text-sm text-gray-500">CEO, CloudSync Solutions</p>
            </div>
          </div>
          <div className="flex mb-2">
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
          </div>
          <p className="text-gray-600">
            "The data room feature made due diligence a breeze. I was able to share documents 
            securely and get AI-driven insights that impressed our investors."
          </p>
        </div>

        <div className="testimonial-card bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              SL
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Sarah Lee</h3>
              <p className="text-sm text-gray-500">Founder, DataDriven Labs</p>
            </div>
          </div>
          <div className="flex mb-2">
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
            <i className="fas fa-star text-yellow-400"></i>
          </div>
          <p className="text-gray-600">
            "I love how easy it was to get a detailed valuation report. SaaS Valuation App 
            helped us identify areas for improvement before our funding round."
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Enhanced Features Section
export const EnhancedFeaturesSection = () => (
  <section className="py-16">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose SaaS Valuation App?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We provide a comprehensive suite of tools to help you understand and grow your SaaS business.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="feature-card bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:transform hover:-translate-y-2">
          <div className="text-teal-500 mb-4">
            <i className="fas fa-calculator text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Accurate Valuations</h3>
          <p className="text-gray-600">
            Get a detailed valuation using multiple methods, tailored to your SaaS metrics.
          </p>
        </div>
        
        <div className="feature-card bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:transform hover:-translate-y-2">
          <div className="text-teal-500 mb-4">
            <i className="fas fa-robot text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Powered Insights</h3>
          <p className="text-gray-600">
            Our AI analyzes your data to provide actionable insights for growth.
          </p>
        </div>
        
        <div className="feature-card bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:transform hover:-translate-y-2">
          <div className="text-teal-500 mb-4">
            <i className="fas fa-lock text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Data Handling</h3>
          <p className="text-gray-600">
            Your data is encrypted and secure, with strict privacy controls.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Pricing Section
export const PricingSection = () => (
  <section id="pricing" className="py-16 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose a plan that fits your needs. Start for free and upgrade as your business grows.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Free</h3>
          <p className="text-4xl font-bold text-gray-800 mb-4">
            $0<span className="text-sm font-normal"> </span>
          </p>
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>Basic Valuation Tools</li>
            <li>Free Analytics Report</li>
            <li>Standard Support</li>
            <li> </li>
          </ul>
          <a 
            href="#valuation" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 inline-block"
          >
            Get Started
          </a>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-teal-500 relative">
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white text-sm font-semibold py-1 px-3 rounded-full">
            Most Popular
          </span>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Pro</h3>
          <p className="text-4xl font-bold text-gray-800 mb-4">
            $29<span className="text-sm font-normal"> </span>
          </p>
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>Advanced Valuation Tools</li>
            <li>AI Powered Valuations</li>
            <li>Priority Support</li>
            <li>AI Insights</li>
          </ul>
          <a 
            href="#valuation" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 inline-block"
          >
            Choose Pro
          </a>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Enterprise</h3>
          <p className="text-4xl font-bold text-gray-800 mb-4">Custom</p>
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>Custom Valuation Models</li>
            <li>Personal Expert Consulting</li>
            <li>24/7 Premium Support</li>
            <li>API Access</li>
          </ul>
          <a 
            href="#contact" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 inline-block"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  </section>
);

// Enhanced Hero Section with Dashboard
export const EnhancedHeroSection = () => (
  <section className="bg-gradient-to-br from-teal-500 to-gray-800 text-white py-20">
    <div className="container mx-auto px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Understand Your SaaS Business Worth in Minutes
      </h1>
      <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
        SaaS Valuation App helps founders like you get an accurate valuation of your business 
        using advanced AI tools—no financial expertise needed.
      </p>
      
      {/* Dashboard Preview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Valuation Dashboard</h2>
        <div className="dashboard-card bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Estimated Value Range</span>
            <span className="text-lg font-bold">$1.2M - $1.8M</span>
          </div>
          <div className="value-bar bg-gray-700 rounded-full h-4 overflow-hidden">
            <div className="value-fill bg-teal-400 h-full rounded-full" style={{width: '60%'}}></div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="metric-box bg-white bg-opacity-15 rounded-lg p-3">
              <p className="text-sm">Revenue Growth</p>
              <p className="text-lg font-semibold">32%</p>
              <p className="text-xs text-green-300">+8% from last year</p>
            </div>
            <div className="metric-box bg-white bg-opacity-15 rounded-lg p-3">
              <p className="text-sm">Profit Margin</p>
              <p className="text-lg font-semibold">18%</p>
              <p className="text-xs text-green-300">+3% from last year</p>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            <span className="w-3 h-3 bg-red-400 rounded-full inline-block mr-1"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block mr-1"></span>
            <span className="w-3 h-3 bg-green-400 rounded-full inline-block mr-2"></span>
            Your business is in the Top 30% of SaaS Companies
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a 
          href="#valuation" 
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          Get Your Valuation
        </a>
        <a 
          href="#demo" 
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          Watch Demo
        </a>
      </div>
    </div>
  </section>
);

// AI Data Room Section
export const AIDataRoomSection = () => (
  <section id="data-room" className="py-16">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">AI-Powered Analytics & Report</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Securely manage and share your business documents with our AI-powered data room, 
          designed for due diligence and investor reviews.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="feature-card bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:transform hover:-translate-y-2">
          <div className="text-teal-500 mb-4">
            <i className="fas fa-lock text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Information Storage</h3>
          <p className="text-gray-600">
            Keep your sensitive information safe with end-to-end encryption and role-based access controls.
          </p>
        </div>
        
        <div className="feature-card bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:transform hover:-translate-y-2">
          <div className="text-teal-500 mb-4">
            <i className="fas fa-robot text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Analysis</h3>
          <p className="text-gray-600">
            Let our AI analyze your inputs and industry trends to highlight risks and opportunities for investors.
          </p>
        </div>
        
        <div className="feature-card bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 hover:transform hover:-translate-y-2">
          <div className="text-teal-500 mb-4">
            <i className="fas fa-users text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Collaborate with Stakeholders</h3>
          <p className="text-gray-600">
            Share documents securely with investors and team members, with detailed activity tracking.
          </p>
        </div>
      </div>
      <div className="text-center mt-12">
        <a 
          href="#valuation" 
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          Ready to go Pro?
        </a>
      </div>
    </div>
  </section>
);

// Resources Section
export const ResourcesSection = () => (
  <section id="resources" className="py-16">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Resources to Grow Your Business</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our guides, templates, and tools to help you scale your SaaS business effectively.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <a href="/blog" className="feature-card bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:transform hover:-translate-y-2">
          <div className="text-teal-500 mb-4">
            <i className="fas fa-book text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Valuation Guide</h3>
          <p className="text-gray-600">
            Learn the ins and outs of SaaS valuation with our comprehensive guide.
          </p>
        </a>
        
        <a href="/blog" className="feature-card bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:transform hover:-translate-y-2">
          <div className="text-teal-500 mb-4">
            <i className="fas fa-file-alt text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Due Diligence Checklist</h3>
          <p className="text-gray-600">
            Prepare for investor reviews with our detailed due diligence checklist.
          </p>
        </a>
        
        <a href="/blog" className="feature-card bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:transform hover:-translate-y-2">
          <div className="text-teal-500 mb-4">
            <i className="fas fa-chart-line text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Growth Calculator</h3>
          <p className="text-gray-600">
            Estimate your growth potential with our free SaaS growth calculator.
          </p>
        </a>
      </div>
    </div>
  </section>
);

// Call to Action Section
export const CTASection = () => (
  <section className="bg-gradient-to-br from-teal-500 to-gray-800 text-white py-16">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Discover Your SaaS Value?</h2>
      <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
        Join thousands of founders who trust SaaS Valuation App to understand their business worth and grow smarter.
      </p>
      <a 
        href="#valuation" 
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
      >
        Get Started Now
      </a>
    </div>
  </section>
);