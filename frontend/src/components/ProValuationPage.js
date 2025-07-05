import React, { useState } from 'react';
import { ValuationForm } from './ValuationForm';
import PaymentSection from './PaymentSection';
import ResultsSection from './ResultsSection';

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

  // Validation functions (same as main App.js)
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

  // Calculate valuation (same logic as main App.js)
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

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/valuations/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setValuationResult(data);
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

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/valuations/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowPayment(false);
        setShowResults(true);
      } else {
        alert('Payment verification failed. Please try again.');
      }
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
        {showPayment ? (
          <PaymentSection
            valuationResult={valuationResult}
            onPaymentSuccess={handlePaymentSuccess}
            onBypassCode={handleBypassCode}
          />
        ) : showResults ? (
          <ResultsSection valuationResult={valuationResult} />
        ) : (
          <ValuationForm
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