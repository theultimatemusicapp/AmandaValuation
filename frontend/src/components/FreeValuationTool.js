import React, { useState } from 'react';

// Simple Free Valuation Tool for Landing Page
export const FreeValuationTool = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    revenue: '',
    profit: '',
    growth: '',
    churn: '',
    industry: ''
  });
  
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateFreeValuation = () => {
    setIsCalculating(true);
    
    // Simple calculation for free tool
    setTimeout(() => {
      const revenue = parseFloat(formData.revenue) || 0;
      const profit = parseFloat(formData.profit) || 0;
      const growth = parseFloat(formData.growth) || 0;
      const churn = parseFloat(formData.churn) || 5;
      
      // Basic multiplier logic
      let baseMultiplier = 3;
      if (growth > 20) baseMultiplier += 1;
      if (growth > 50) baseMultiplier += 0.5;
      if (churn < 5) baseMultiplier += 0.5;
      if (churn > 10) baseMultiplier -= 0.5;
      
      // Industry adjustments
      if (formData.industry === 'Technology') baseMultiplier += 0.5;
      if (formData.industry === 'Healthcare') baseMultiplier += 0.3;
      
      const estimatedValue = revenue * baseMultiplier;
      const range = {
        low: estimatedValue * 0.8,
        high: estimatedValue * 1.2
      };
      
      setResult({
        value: estimatedValue,
        range: range,
        multiplier: baseMultiplier
      });
      setIsCalculating(false);
    }, 2000);
  };

  const isFormValid = formData.revenue && formData.profit && formData.growth && formData.industry;

  return (
    <section id="valuation" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">FREE Quick Valuation Tool</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get an instant estimate of your SaaS business value in under 2 minutes. 
            For a comprehensive analysis, try our Pro tool.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          {!result ? (
            <>
              {/* Free Tool Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Annual Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => handleInputChange('revenue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                    placeholder="e.g., 500000"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Annual Profit/EBITDA ($)
                  </label>
                  <input
                    type="number"
                    value={formData.profit}
                    onChange={(e) => handleInputChange('profit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                    placeholder="e.g., 100000"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Growth Rate (% YoY)
                  </label>
                  <input
                    type="number"
                    value={formData.growth}
                    onChange={(e) => handleInputChange('growth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Monthly Churn Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.churn}
                    onChange={(e) => handleInputChange('churn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                    placeholder="e.g., 5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Select your industry</option>
                    <option value="Technology">Technology/SaaS</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Retail">E-commerce/Retail</option>
                    <option value="Education">Education</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={calculateFreeValuation}
                  disabled={!isFormValid || isCalculating}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                    isFormValid && !isCalculating
                      ? 'bg-teal-500 hover:bg-teal-600 transform hover:-translate-y-1'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isCalculating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </span>
                  ) : (
                    'Get Free Estimate'
                  )}
                </button>
              </div>

              {/* Pro Tool CTA */}
              <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Want a Detailed Professional Valuation?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get comprehensive analysis with 80+ factors, multiple valuation methods, 
                    interactive charts, and professional PDF reports.
                  </p>
                  <button
                    onClick={() => setCurrentPage('pro')}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Try Pro Valuation Tool →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Results Display */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Free Valuation Estimate</h3>
                
                <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-8 rounded-lg mb-6">
                  <div className="text-4xl font-bold mb-2">
                    ${Math.round(result.value).toLocaleString()}
                  </div>
                  <div className="text-lg opacity-90">
                    Range: ${Math.round(result.range.low).toLocaleString()} - ${Math.round(result.range.high).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">{result.multiplier.toFixed(1)}x</div>
                    <div className="text-sm text-gray-600">Revenue Multiple</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formData.growth}%</div>
                    <div className="text-sm text-gray-600">Growth Rate</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{formData.churn}%</div>
                    <div className="text-sm text-gray-600">Churn Rate</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Disclaimer:</strong> This is a basic estimate for informational purposes only. 
                    Actual valuations may vary significantly based on additional factors.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setResult(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
                  >
                    Calculate Again
                  </button>
                  <button
                    onClick={() => setCurrentPage('pro')}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
                  >
                    Get Professional Valuation
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};