import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FeaturesSection, HowItWorksSection, ValuationForm } from './components/ValuationForm';
import { Step5, Step6, Step7 } from './components/AdditionalSteps';
import PaymentSection from './components/PaymentSection';
import ResultsSection from './components/ResultsSection';
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Main App Component
function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Methods
    methods: [],
    
    // Step 2: Financial Metrics
    arr: '',
    mrr: '',
    ltv: '',
    cac: '',
    gross_margin: '',
    net_profit: '',
    burn_rate: '',
    runway: '',
    
    // Step 3: Growth & Churn
    revenue_growth_yoy: '',
    revenue_growth_mom: '',
    customer_churn: '',
    revenue_churn: '',
    
    // Step 4: Customer & Market
    active_customers: '',
    monthly_active_users: '',
    retention_rate: '',
    nps: '',
    customer_segment: '',
    buyer_type: '',
    
    // Step 5: Product & Technology
    product_market_fit: '',
    proprietary_tech: '',
    code_quality: '',
    scalable_infrastructure: '',
    feature_release_frequency: '',
    security_compliance: '',
    
    // Step 6: Team & Operations
    fte: '',
    key_staff: '',
    turnover_rate: '',
    eng_sales_ratio: '',
    support_tickets: '',
    support_rating: '',
    headcount_growth: '',
    
    // Step 7: Legal & Risk
    legal_entity: '',
    ip_ownership: '',
    contract_length: '',
    contract_value: '',
    vendor_lockin: '',
    legal_issues: '',
    data_privacy: '',
    cyber_insurance: '',
    debt_level: ''
  });

  const [errors, setErrors] = useState({});
  const [valuationResult, setValuationResult] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {};
    if (formData.methods.length === 0 || formData.methods.length > 3) {
      newErrors.methods = 'Please select 1 to 3 valuation methods';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const requiredFields = ['arr', 'mrr', 'ltv', 'cac', 'gross_margin', 'net_profit', 'burn_rate', 'runway'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || parseFloat(formData[field]) < 0) {
        newErrors[field] = 'Please enter a valid positive number';
      }
    });
    
    if (formData.gross_margin && (parseFloat(formData.gross_margin) < 0 || parseFloat(formData.gross_margin) > 100)) {
      newErrors.gross_margin = 'Please enter a percentage between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    const percentageFields = ['revenue_growth_yoy', 'revenue_growth_mom', 'customer_churn', 'revenue_churn'];
    
    percentageFields.forEach(field => {
      if (!formData[field] || parseFloat(formData[field]) < 0 || parseFloat(formData[field]) > 100) {
        newErrors[field] = 'Please enter a percentage between 0 and 100';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    
    if (!formData.active_customers || parseInt(formData.active_customers) < 0) {
      newErrors.active_customers = 'Please enter a valid number';
    }
    if (!formData.monthly_active_users || parseInt(formData.monthly_active_users) < 0) {
      newErrors.monthly_active_users = 'Please enter a valid number';
    }
    if (!formData.retention_rate || parseFloat(formData.retention_rate) < 0 || parseFloat(formData.retention_rate) > 100) {
      newErrors.retention_rate = 'Please enter a percentage between 0 and 100';
    }
    if (!formData.nps || parseFloat(formData.nps) < -100 || parseFloat(formData.nps) > 100) {
      newErrors.nps = 'Please enter a value between -100 and 100';
    }
    if (!formData.customer_segment) {
      newErrors.customer_segment = 'Please select an option';
    }
    if (!formData.buyer_type) {
      newErrors.buyer_type = 'Please select an option';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep5 = () => {
    const newErrors = {};
    const requiredFields = ['product_market_fit', 'proprietary_tech', 'code_quality', 'scalable_infrastructure', 'feature_release_frequency', 'security_compliance'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Please select an option';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep6 = () => {
    const newErrors = {};
    
    if (!formData.fte || parseInt(formData.fte) < 0) {
      newErrors.fte = 'Please enter a valid number';
    }
    if (!formData.key_staff || parseInt(formData.key_staff) < 0) {
      newErrors.key_staff = 'Please enter a valid number';
    }
    if (!formData.turnover_rate || parseFloat(formData.turnover_rate) < 0 || parseFloat(formData.turnover_rate) > 100) {
      newErrors.turnover_rate = 'Please enter a percentage between 0 and 100';
    }
    if (!formData.eng_sales_ratio || parseFloat(formData.eng_sales_ratio) < 0) {
      newErrors.eng_sales_ratio = 'Please enter a valid number';
    }
    if (!formData.support_tickets || parseInt(formData.support_tickets) < 0) {
      newErrors.support_tickets = 'Please enter a valid number';
    }
    if (!formData.support_rating || parseFloat(formData.support_rating) < 1 || parseFloat(formData.support_rating) > 10) {
      newErrors.support_rating = 'Please enter a rating between 1 and 10';
    }
    if (!formData.headcount_growth || parseFloat(formData.headcount_growth) < -100 || parseFloat(formData.headcount_growth) > 100) {
      newErrors.headcount_growth = 'Please enter a percentage between -100 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep7 = () => {
    const newErrors = {};
    const requiredFields = ['legal_entity', 'ip_ownership', 'vendor_lockin', 'legal_issues', 'data_privacy', 'cyber_insurance'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Please select an option';
      }
    });
    
    if (!formData.contract_length || parseFloat(formData.contract_length) < 0) {
      newErrors.contract_length = 'Please enter a valid number';
    }
    if (!formData.contract_value || parseFloat(formData.contract_value) < 0) {
      newErrors.contract_value = 'Please enter a valid number';
    }
    if (!formData.debt_level || parseFloat(formData.debt_level) < 0) {
      newErrors.debt_level = 'Please enter a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const nextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1: isValid = validateStep1(); break;
      case 2: isValid = validateStep2(); break;
      case 3: isValid = validateStep3(); break;
      case 4: isValid = validateStep4(); break;
      case 5: isValid = validateStep5(); break;
      case 6: isValid = validateStep6(); break;
      case 7: isValid = validateStep7(); break;
      default: isValid = true;
    }
    
    if (isValid) {
      if (currentStep === 7) {
        calculateValuation();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Calculate valuation
  const calculateValuation = async () => {
    setIsLoading(true);
    try {
      // Convert form data to proper types
      const payload = {
        ...formData,
        // Convert numbers
        arr: parseFloat(formData.arr),
        mrr: parseFloat(formData.mrr),
        ltv: parseFloat(formData.ltv),
        cac: parseFloat(formData.cac),
        gross_margin: parseFloat(formData.gross_margin),
        net_profit: parseFloat(formData.net_profit),
        burn_rate: parseFloat(formData.burn_rate),
        runway: parseFloat(formData.runway),
        revenue_growth_yoy: parseFloat(formData.revenue_growth_yoy),
        revenue_growth_mom: parseFloat(formData.revenue_growth_mom),
        customer_churn: parseFloat(formData.customer_churn),
        revenue_churn: parseFloat(formData.revenue_churn),
        active_customers: parseInt(formData.active_customers),
        monthly_active_users: parseInt(formData.monthly_active_users),
        retention_rate: parseFloat(formData.retention_rate),
        nps: parseFloat(formData.nps),
        fte: parseInt(formData.fte),
        key_staff: parseInt(formData.key_staff),
        turnover_rate: parseFloat(formData.turnover_rate),
        eng_sales_ratio: parseFloat(formData.eng_sales_ratio),
        support_tickets: parseInt(formData.support_tickets),
        support_rating: parseFloat(formData.support_rating),
        headcount_growth: parseFloat(formData.headcount_growth),
        contract_length: parseFloat(formData.contract_length),
        contract_value: parseFloat(formData.contract_value),
        debt_level: parseFloat(formData.debt_level)
      };

      const response = await axios.post(`${API}/valuations/calculate`, payload);
      setValuationResult(response.data);
      setShowPayment(true);
    } catch (error) {
      console.error('Error calculating valuation:', error);
      alert('Error calculating valuation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment/bypass
  const handlePaymentSuccess = async (paymentData = null) => {
    try {
      const payload = {
        valuation_id: valuationResult.id,
        payment_method: paymentData ? 'paypal' : 'bypass',
        payment_data: paymentData,
        bypass_code: paymentData ? null : 'fuckpete'
      };

      await axios.post(`${API}/valuations/verify-payment`, payload);
      setShowPayment(false);
      setShowResults(true);
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Payment verification failed. Please try again.');
    }
  };

  const handleBypassCode = (code) => {
    if (code === 'fuckpete') {
      handlePaymentSuccess();
    } else {
      alert('Invalid bypass code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      
      {/* Main Content */}
      <main className="flex-grow">
        {!showPayment && !showResults && (
          <>
            {/* Hero Section */}
            <HeroSection />
            
            {/* Features Section */}
            <FeaturesSection />
            
            {/* How It Works */}
            <HowItWorksSection />
            
            {/* Valuation Form */}
            <ValuationForm
              currentStep={currentStep}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              isLoading={isLoading}
            />
          </>
        )}
        
        {showPayment && (
          <PaymentSection
            valuationResult={valuationResult}
            onPaymentSuccess={handlePaymentSuccess}
            onBypassCode={handleBypassCode}
          />
        )}
        
        {showResults && (
          <ResultsSection valuationResult={valuationResult} />
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Header Component
const Header = ({ mobileMenuOpen, toggleMobileMenu }) => (
  <header className="bg-gray-800 text-white py-3 sticky top-0 z-50 shadow-lg">
    <div className="container mx-auto px-4 flex justify-between items-center">
      <div className="flex items-center">
        <i className="fas fa-chart-line text-teal-400 mr-2 text-xl"></i>
        <div className="text-xl font-bold">
          SaaS<span className="text-teal-400">Val</span>
        </div>
      </div>
      <nav className="hidden md:flex space-x-6">
        <a href="#valuation" className="hover:text-teal-400 transition-colors duration-300">Valuation</a>
        <a href="#features" className="hover:text-teal-400 transition-colors duration-300">Features</a>
        <a href="#how-it-works" className="hover:text-teal-400 transition-colors duration-300">How It Works</a>
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
          <a href="#valuation" className="block py-2 hover:text-teal-400 transition-colors duration-300">Valuation</a>
          <a href="#features" className="block py-2 hover:text-teal-400 transition-colors duration-300">Features</a>
          <a href="#how-it-works" className="block py-2 hover:text-teal-400 transition-colors duration-300">How It Works</a>
        </nav>
      </div>
    )}
  </header>
);

// Hero Section
const HeroSection = () => (
  <section className="bg-gradient-to-br from-teal-500 to-gray-800 text-white py-20">
    <div className="container mx-auto px-4 text-center max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        Professional SaaS Business Valuation <br />
        <span className="text-teal-300">Powered by Real Metrics</span>
      </h1>
      <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
        Get an accurate, data-driven valuation of your SaaS business with our comprehensive evaluation tool.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a 
          href="#valuation" 
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
        >
          <i className="fas fa-calculator mr-2"></i> Start Valuation
        </a>
        <a 
          href="#how-it-works" 
          className="bg-white text-gray-800 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
        >
          <i className="fas fa-play-circle mr-2"></i> How It Works
        </a>
      </div>
    </div>
  </section>
);

export default App;