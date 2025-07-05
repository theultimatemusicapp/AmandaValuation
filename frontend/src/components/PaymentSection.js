import React, { useState } from 'react';

export const PaymentSection = ({ valuationResult, onPaymentSuccess, onBypassCode }) => {
  const [bypassCodeInput, setBypassCodeInput] = useState('');
  const [showBypassInput, setShowBypassInput] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleBypassSubmit = (e) => {
    e.preventDefault();
    onBypassCode(bypassCodeInput);
  };

  const handlePayPalSuccess = () => {
    setIsProcessingPayment(true);
    // Simulate PayPal success
    setTimeout(() => {
      onPaymentSuccess({ paypal_transaction_id: 'test_' + Date.now() });
      setIsProcessingPayment(false);
    }, 2000);
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6">
            <i className="fas fa-check-circle text-xl mr-2"></i>
            <strong>Valuation Complete!</strong> Your business has been analyzed using {valuationResult?.valuations?.length || 0} method(s).
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Unlock Your Pro Valuation Results</h1>
          <p className="text-gray-600 mb-2">
            Your comprehensive valuation report is ready! Complete payment to access:
          </p>
          
          {/* Preview of valuation amount */}
          <div className="bg-white border-2 border-teal-500 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Estimated Valuation</h3>
            <div className="text-3xl font-bold text-teal-600">
              ${Math.round(valuationResult?.average_valuation || 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Confidence Score: {Math.round(valuationResult?.confidence_score || 0)}%
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <i className="fas fa-lock mr-1"></i>
              Complete payment to see full breakdown
            </div>
          </div>
        </div>

        {/* What You Get */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">What You Get with Pro Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-teal-500 text-3xl mb-3">
                <i className="fas fa-chart-pie"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Multiple Valuation Methods</h3>
              <p className="text-gray-600 text-sm">
                Detailed breakdown of each selected method with explanations
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-teal-500 text-3xl mb-3">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Interactive Charts</h3>
              <p className="text-gray-600 text-sm">
                Visual representations of your metrics and comparisons
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-teal-500 text-3xl mb-3">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Actionable Insights</h3>
              <p className="text-gray-600 text-sm">
                Specific recommendations to improve your valuation
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-teal-500 text-3xl mb-3">
                <i className="fas fa-file-pdf"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Professional PDF Report</h3>
              <p className="text-gray-600 text-sm">
                Investor-ready report with all analysis and charts
              </p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Choose Your Payment Method</h2>
            
            {/* PayPal Payment */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Secure Payment - $29.99</h3>
              
              <div className="bg-gray-50 border rounded-lg p-6 text-center">
                <div className="mb-4">
                  <i className="fab fa-paypal text-4xl text-blue-600"></i>
                </div>
                
                {!isProcessingPayment ? (
                  <button
                    onClick={handlePayPalSuccess}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
                  >
                    <i className="fab fa-paypal mr-2"></i>
                    Pay with PayPal
                  </button>
                ) : (
                  <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-blue-600 text-2xl mb-2"></i>
                    <p className="text-gray-600">Processing payment...</p>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-3">
                  Secure payment processing • Instant access
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Bypass Code Section */}
            <div className="text-center">
              <button
                onClick={() => setShowBypassInput(!showBypassInput)}
                className="text-teal-600 hover:text-teal-700 font-medium text-sm underline"
              >
                Have a promotional code?
              </button>
              
              {showBypassInput && (
                <form onSubmit={handleBypassSubmit} className="mt-4">
                  <div className="flex max-w-sm mx-auto">
                    <input
                      type="text"
                      value={bypassCodeInput}
                      onChange={(e) => setBypassCodeInput(e.target.value)}
                      placeholder="Enter promotional code"
                      className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring focus:ring-teal-400 focus:border-teal-500"
                    />
                    <button
                      type="submit"
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-r-lg transition-colors duration-300"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your promotional code for free access
                  </p>
                </form>
              )}
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <i className="fas fa-shield-alt mr-1"></i>
            Secure payment processing • No recurring charges • 30-day money back guarantee
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;