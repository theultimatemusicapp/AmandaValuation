import React from 'react';

// Enhanced Tooltip Component
const Tooltip = ({ text, children }) => (
  <div className="relative inline-block group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
    </div>
  </div>
);

// Explainer Box Component
const ExplainerBox = ({ title, content }) => (
  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
    <div className="flex">
      <div className="flex-shrink-0">
        <i className="fas fa-info-circle text-blue-400"></i>
      </div>
      <div className="ml-3">
        <h4 className="text-sm font-semibold text-blue-800">{title}</h4>
        <p className="text-sm text-blue-700 mt-1">{content}</p>
      </div>
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">Progress</span>
        <span className="text-sm font-medium text-gray-600">{currentStep}/{totalSteps}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Started</span>
        <span>Complete</span>
      </div>
    </div>
  );
};

// Enhanced Step 1: Valuation Methods
export const EnhancedStep1 = ({ formData, updateFormData, errors }) => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Step 1: Select Valuation Methods</h2>
      <p className="text-gray-600">Choose 1-3 methods for comprehensive analysis. Each method provides different insights.</p>
    </div>

    <ExplainerBox 
      title="Why Multiple Methods?" 
      content="Using multiple valuation methods provides a more accurate and comprehensive assessment of your business value. Different methods capture different aspects of your business performance and market position."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          value: 'revenue_multiple',
          title: 'Revenue Multiple',
          description: 'Based on ARR/MRR with industry multipliers',
          tooltip: 'Most common for SaaS companies. Compares your revenue to similar businesses that have sold.',
          icon: 'fas fa-chart-line',
          recommended: true
        },
        {
          value: 'dcf',
          title: 'Discounted Cash Flow (DCF)',
          description: 'Future cash flow projections discounted to present value',
          tooltip: 'Best for mature businesses with predictable cash flows. Projects future earnings.',
          icon: 'fas fa-calculator',
          recommended: false
        },
        {
          value: 'asset_based',
          title: 'Asset-Based',
          description: 'Valuation based on company assets and IP',
          tooltip: 'Good for asset-heavy businesses or those with significant intellectual property.',
          icon: 'fas fa-building',
          recommended: false
        },
        {
          value: 'market_comp',
          title: 'Market Comparables',
          description: 'Comparison to similar public companies',
          tooltip: 'Compares your metrics to publicly traded companies in your industry.',
          icon: 'fas fa-balance-scale',
          recommended: false
        }
      ].map((method) => (
        <div 
          key={method.value}
          className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
            formData.methods.includes(method.value) 
              ? 'border-teal-500 bg-teal-50' 
              : 'border-gray-200 hover:border-teal-300'
          }`}
          onClick={() => {
            const newMethods = formData.methods.includes(method.value)
              ? formData.methods.filter(m => m !== method.value)
              : [...formData.methods, method.value].slice(0, 3);
            updateFormData('methods', newMethods);
          }}
        >
          {method.recommended && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Recommended
            </div>
          )}
          
          <div className="flex items-start space-x-3">
            <div className={`text-2xl ${method.recommended ? 'text-green-500' : 'text-teal-500'}`}>
              <i className={method.icon}></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800">{method.title}</h3>
                <Tooltip text={method.tooltip}>
                  <i className="fas fa-question-circle text-gray-400 cursor-help"></i>
                </Tooltip>
              </div>
              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
            </div>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              formData.methods.includes(method.value) 
                ? 'border-teal-500 bg-teal-500' 
                : 'border-gray-300'
            }`}>
              {formData.methods.includes(method.value) && (
                <i className="fas fa-check text-white text-xs"></i>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {errors.methods && (
      <p className="text-red-500 text-sm mt-4 flex items-center">
        <i className="fas fa-exclamation-triangle mr-2"></i>
        {errors.methods}
      </p>
    )}

    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800">
        <strong>Tip:</strong> We recommend selecting Revenue Multiple for SaaS businesses, 
        plus one additional method for comparison. Avoid selecting more than 3 methods.
      </p>
    </div>
  </div>
);

// Enhanced Step 2: Financial Metrics
export const EnhancedStep2 = ({ formData, updateFormData, errors }) => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Step 2: Financial Metrics</h2>
      <p className="text-gray-600">Core financial data that drives your business valuation</p>
    </div>

    <ExplainerBox 
      title="Why These Metrics Matter" 
      content="These financial metrics are the foundation of any SaaS valuation. They show the health, growth potential, and sustainability of your business model."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          field: 'arr',
          label: 'Annual Recurring Revenue (ARR)',
          placeholder: '1200000',
          tooltip: 'Your total recurring revenue normalized to a yearly amount. The most important SaaS metric.',
          icon: 'fas fa-dollar-sign',
          prefix: '$'
        },
        {
          field: 'mrr',
          label: 'Monthly Recurring Revenue (MRR)',
          placeholder: '100000',
          tooltip: 'Monthly recurring revenue. Should be ARR ÷ 12 for consistency.',
          icon: 'fas fa-calendar',
          prefix: '$'
        },
        {
          field: 'ltv',
          label: 'Customer Lifetime Value (LTV)',
          placeholder: '5000',
          tooltip: 'Average revenue per customer over their entire relationship. Higher is better.',
          icon: 'fas fa-user-circle',
          prefix: '$'
        },
        {
          field: 'cac',
          label: 'Customer Acquisition Cost (CAC)',
          placeholder: '1000',
          tooltip: 'Total cost to acquire one customer. Lower is better. LTV/CAC ratio should be 3+ ideally.',
          icon: 'fas fa-bullseye',
          prefix: '$'
        },
        {
          field: 'gross_margin',
          label: 'Gross Margin',
          placeholder: '85',
          tooltip: 'Percentage of revenue after direct costs. SaaS companies typically have 70-90% gross margins.',
          icon: 'fas fa-percentage',
          suffix: '%'
        },
        {
          field: 'net_profit',
          label: 'Net Profit Margin',
          placeholder: '15',
          tooltip: 'Percentage of revenue remaining after all expenses. Shows operational efficiency.',
          icon: 'fas fa-chart-pie',
          suffix: '%'
        },
        {
          field: 'burn_rate',
          label: 'Monthly Burn Rate',
          placeholder: '50000',
          tooltip: 'How much cash you spend each month. Important for runway calculation.',
          icon: 'fas fa-fire',
          prefix: '$'
        },
        {
          field: 'runway',
          label: 'Cash Runway (Months)',
          placeholder: '18',
          tooltip: 'How many months of cash you have left at current burn rate. 12+ months is healthy.',
          icon: 'fas fa-clock',
          suffix: ' months'
        }
      ].map((field) => (
        <div key={field.field} className="space-y-2">
          <div className="flex items-center space-x-2">
            <i className={`${field.icon} text-teal-500`}></i>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <Tooltip text={field.tooltip}>
              <i className="fas fa-question-circle text-gray-400 cursor-help"></i>
            </Tooltip>
          </div>
          
          <div className="relative">
            {field.prefix && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{field.prefix}</span>
              </div>
            )}
            <input
              type="number"
              value={formData[field.field]}
              onChange={(e) => updateFormData(field.field, e.target.value)}
              className={`w-full ${field.prefix ? 'pl-8' : 'pl-3'} ${field.suffix ? 'pr-16' : 'pr-3'} py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                errors[field.field] ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={field.placeholder}
            />
            {field.suffix && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{field.suffix}</span>
              </div>
            )}
          </div>
          
          {errors[field.field] && (
            <p className="text-red-500 text-xs flex items-center">
              <i className="fas fa-exclamation-circle mr-1"></i>
              {errors[field.field]}
            </p>
          )}
        </div>
      ))}
    </div>

    {/* Real-time Metrics Display */}
    {formData.ltv && formData.cac && (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Key Ratio Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {(parseFloat(formData.ltv) / parseFloat(formData.cac)).toFixed(1)}:1
            </div>
            <div className="text-sm text-gray-600">LTV:CAC Ratio</div>
            <div className="text-xs text-gray-500">
              {(parseFloat(formData.ltv) / parseFloat(formData.cac)) >= 3 ? '✅ Healthy' : '⚠️ Needs improvement'}
            </div>
          </div>
          
          {formData.arr && formData.mrr && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(parseFloat(formData.arr) / 12 / parseFloat(formData.mrr)).toFixed(1)}x
              </div>
              <div className="text-sm text-gray-600">ARR/MRR Consistency</div>
              <div className="text-xs text-gray-500">
                {Math.abs(parseFloat(formData.arr) / 12 - parseFloat(formData.mrr)) < parseFloat(formData.mrr) * 0.1 ? '✅ Consistent' : '⚠️ Check numbers'}
              </div>
            </div>
          )}
          
          {formData.gross_margin && (
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formData.gross_margin}%
              </div>
              <div className="text-sm text-gray-600">Gross Margin</div>
              <div className="text-xs text-gray-500">
                {parseFloat(formData.gross_margin) >= 70 ? '✅ Excellent' : '⚠️ Below SaaS standard'}
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-sm text-blue-800">
        <strong>Tip:</strong> Ensure your ARR and MRR are consistent (ARR ÷ 12 = MRR). 
        A healthy LTV:CAC ratio is 3:1 or higher, and gross margins above 70% are typical for SaaS.
      </p>
    </div>
  </div>
);

// Enhanced Valuation Form Component
export const EnhancedValuationForm = ({ currentStep, formData, errors, updateFormData, nextStep, prevStep, isLoading }) => {
  const totalSteps = 7;

  return (
    <div className="container mx-auto px-6 py-8">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      {currentStep === 1 && (
        <EnhancedStep1 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={errors} 
        />
      )}
      
      {currentStep === 2 && (
        <EnhancedStep2 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={errors} 
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            currentStep === 1 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-500 text-white hover:bg-gray-600 transform hover:-translate-y-1'
          }`}
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Previous
        </button>

        <button
          onClick={nextStep}
          disabled={isLoading}
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : currentStep === totalSteps ? (
            <>
              Calculate Valuation
              <i className="fas fa-chart-line ml-2"></i>
            </>
          ) : (
            <>
              Next
              <i className="fas fa-arrow-right ml-2"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};