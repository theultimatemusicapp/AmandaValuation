import React, { useState } from 'react';
import { EnhancedValuationForm } from './EnhancedValuationForm';
import PaymentSection from './PaymentSection';
import { EnhancedResultsSection } from './EnhancedResultsSection';

// Professional Valuation Page Component
export const ProValuationPage = ({ setCurrentPage }) => {
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

  // Simplified validation for demo (implement other steps as needed)
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: return validateStep1();
      case 2: return validateStep2();
      default: return true; // For demo purposes
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (validateCurrentStep()) {
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

  // Calculate valuation with enhanced mock data
  const calculateValuation = async () => {
    setIsLoading(true);
    
    // For demo purposes, create enhanced mock valuation result
    setTimeout(() => {
      const arr = parseFloat(formData.arr) || 1000000;
      const mockResult = {
        id: 'val_' + Math.random().toString(36).substr(2, 9),
        average_valuation: arr * 5.2, // Mock 5.2x revenue multiple
        confidence_score: 82,
        growth_score: 78,
        profitability_score: 65,
        customer_score: 80,
        market_score: 75,
        operational_score: 70,
        arr: arr,
        methods: {
          'Revenue Multiple': {
            value: arr * 5.2,
            range: [arr * 4.5, arr * 6.0],
            explanation: `Based on your ARR of $${arr.toLocaleString()}, we applied a 5.2x revenue multiple. This reflects your strong growth metrics (${formData.revenue_growth_yoy || 25}% YoY), healthy gross margins (${formData.gross_margin || 80}%), and low churn rate (${formData.customer_churn || 5}%). SaaS companies with similar profiles typically trade at 4.5x-6x revenue multiples.`,
            confidence: 85
          },
          'DCF Analysis': {
            value: arr * 4.8,
            range: [arr * 4.2, arr * 5.4],
            explanation: `Our discounted cash flow analysis projects strong free cash flow growth over 5 years, discounted at 12% WACC. Your improving unit economics (LTV:CAC of ${(parseFloat(formData.ltv) / parseFloat(formData.cac) || 3.5).toFixed(1)}:1) and expanding gross margins support sustainable cash generation.`,
            confidence: 78
          },
          'Asset-Based': {
            value: arr * 3.8,
            range: [arr * 3.2, arr * 4.4],
            explanation: `Asset-based valuation considers your technology stack, customer relationships, and intellectual property. While conservative for a SaaS business, this provides a strong floor value anchored in tangible and intangible assets.`,
            confidence: 70
          }
        }
      };
      
      setValuationResult(mockResult);
      setShowPayment(true);
      setIsLoading(false);
    }, 3000);
  };

  // Handle payment/bypass
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowResults(true);
  };

  const handleBypassCode = (code) => {
    if (code === 'fuckpete') {
      handlePaymentSuccess();
    } else {
      alert('Invalid bypass code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Professional SaaS Valuation
          </h1>
          <p className="text-xl opacity-90 mb-6 max-w-3xl mx-auto">
            Get a comprehensive, AI-powered valuation with 80+ factors, multiple methods, 
            and professional-grade reports
          </p>
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-white text-teal-600 hover:bg-gray-100 font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {showResults ? (
          <EnhancedResultsSection valuationResult={valuationResult} />
        ) : showPayment ? (
          <PaymentSection
            valuationResult={valuationResult}
            onPaymentSuccess={handlePaymentSuccess}
            onBypassCode={handleBypassCode}
          />
        ) : (
          <EnhancedValuationForm
            currentStep={currentStep}
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
};