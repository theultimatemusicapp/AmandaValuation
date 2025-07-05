import React from 'react';

// Features Section Component
export const FeaturesSection = () => (
  <section id="features" className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Valuation Tool</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our platform combines industry expertise with advanced analytics to deliver the most accurate SaaS valuation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-teal-500 text-3xl mb-4">
            <i className="fas fa-chart-pie"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Multiple Valuation Methods</h3>
          <p className="text-gray-600">
            We use revenue multipliers, income-based, earnings-based, and DCF methods to provide a comprehensive valuation range.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-teal-500 text-3xl mb-4">
            <i className="fas fa-database"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Data-Driven Insights</h3>
          <p className="text-gray-600">
            Our algorithms analyze 50+ metrics from your business to calculate the most accurate valuation possible.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-teal-500 text-3xl mb-4">
            <i className="fas fa-file-pdf"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Professional Reports</h3>
          <p className="text-gray-600">
            Download detailed PDF reports perfect for investors, buyers, or internal planning.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// How It Works Section
export const HowItWorksSection = () => (
  <section id="how-it-works" className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How Our Valuation Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our 7-step process evaluates every aspect of your SaaS business to deliver an accurate valuation.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {[
          {
            step: 1,
            title: "Select Valuation Methods",
            description: "Choose from revenue multipliers, income-based, earnings-based, or discounted cash flow (DCF) methods. Select up to 3 methods that best fit your business model."
          },
          {
            step: 2,
            title: "Enter Financial Metrics",
            description: "Provide key financial data including ARR, MRR, LTV, CAC, gross margin, net profit, burn rate, and runway. These form the foundation of your valuation."
          },
          {
            step: 3,
            title: "Growth & Churn Rates",
            description: "Input your revenue growth rates (YoY and MoM) along with customer and revenue churn rates. These metrics significantly impact your valuation multipliers."
          },
          {
            step: 4,
            title: "Customer & Market Metrics",
            description: "Detail your customer base including active customers, MAU, retention rate, NPS, customer segment, and potential buyer types to refine your valuation."
          },
          {
            step: 5,
            title: "Product & Technology",
            description: "Assess your product-market fit, proprietary technology, code quality, infrastructure scalability, release frequency, and security compliance."
          },
          {
            step: 6,
            title: "Team & Operations",
            description: "Provide details about your team size, key staff, turnover rate, engineering to sales ratio, support metrics, and headcount growth."
          },
          {
            step: 7,
            title: "Legal, Contracts & Risk",
            description: "Finalize with legal entity type, IP ownership, contract details, vendor lock-in, legal issues, data privacy compliance, cybersecurity insurance, and debt level."
          }
        ].map((item) => (
          <div key={item.step} className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mb-4 md:mb-0">
              <div className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <span className="font-bold text-xl">{item.step}</span>
              </div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Main Valuation Form Component
export const ValuationForm = ({ currentStep, formData, errors, updateFormData, nextStep, prevStep, isLoading }) => (
  <section id="valuation" className="py-12 bg-gray-50">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pro Valuation Tool</h2>
        <p className="text-base text-gray-600 max-w-xl mx-auto">
          Answer questions step-by-step to get a detailed valuation report with actionable insights.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative pt-1">
          <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded bg-gray-200">
            <div 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500" 
              style={{ width: `${(currentStep / 7) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600 text-sm">
            Step {currentStep} of 7
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        {currentStep === 1 && <Step1 formData={formData} errors={errors} updateFormData={updateFormData} />}
        {currentStep === 2 && <Step2 formData={formData} errors={errors} updateFormData={updateFormData} />}
        {currentStep === 3 && <Step3 formData={formData} errors={errors} updateFormData={updateFormData} />}
        {currentStep === 4 && <Step4 formData={formData} errors={errors} updateFormData={updateFormData} />}
        {currentStep === 5 && <Step5 formData={formData} errors={errors} updateFormData={updateFormData} />}
        {currentStep === 6 && <Step6 formData={formData} errors={errors} updateFormData={updateFormData} />}
        {currentStep === 7 && <Step7 formData={formData} errors={errors} updateFormData={updateFormData} />}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          {currentStep > 1 && (
            <button 
              onClick={prevStep}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Previous
            </button>
          )}
          <button 
            onClick={nextStep}
            disabled={isLoading}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ml-auto disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Calculating...
              </>
            ) : (
              currentStep === 7 ? 'Calculate Valuation' : 'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  </section>
);

// Step 1: Select Valuation Methods
const Step1 = ({ formData, errors, updateFormData }) => {
  const handleMethodChange = (method) => {
    const currentMethods = formData.methods || [];
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];
    
    updateFormData('methods', newMethods);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select Valuation Methods</h3>
      <p className="text-gray-600 mb-4 text-sm">
        Choose up to 3 valuation methods for your SaaS business.
      </p>
      
      <div className="space-y-3">
        {[
          { id: 'multiplier', label: 'Revenue Multiplier' },
          { id: 'income', label: 'Income-Based' },
          { id: 'earnings', label: 'Earnings-Based' },
          { id: 'dcf', label: 'Discounted Cash Flow (DCF)' }
        ].map((method) => (
          <label key={method.id} className="flex items-center">
            <input 
              type="checkbox" 
              checked={formData.methods.includes(method.id)}
              onChange={() => handleMethodChange(method.id)}
              className="form-checkbox h-5 w-5 text-teal-500" 
            />
            <span className="ml-2">{method.label}</span>
          </label>
        ))}
        
        {errors.methods && (
          <p className="text-red-500 text-sm mt-2">{errors.methods}</p>
        )}
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-3 rounded">
          <h4 className="font-semibold text-sm">Revenue Multiplier</h4>
          <p className="text-xs text-gray-600">Multiplies ARR by industry factor (5-8x)</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <h4 className="font-semibold text-sm">Income-Based</h4>
          <p className="text-xs text-gray-600">Values based on profit margins</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <h4 className="font-semibold text-sm">Earnings-Based</h4>
          <p className="text-xs text-gray-600">Combines revenue and profit metrics</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <h4 className="font-semibold text-sm">DCF</h4>
          <p className="text-xs text-gray-600">Future cash flow projections</p>
        </div>
      </div>
    </div>
  );
};

// Step 2: Financial Metrics
const Step2 = ({ formData, errors, updateFormData }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Financial Metrics</h3>
    <p className="text-gray-600 mb-4 text-sm">
      Enter key financial figures for your business.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { id: 'arr', label: 'Annual Recurring Revenue (ARR) ($)', placeholder: 'e.g., 500000' },
        { id: 'mrr', label: 'Monthly Recurring Revenue (MRR) ($)', placeholder: 'e.g., 41667' },
        { id: 'ltv', label: 'Customer Lifetime Value (LTV) ($)', placeholder: 'e.g., 2000' },
        { id: 'cac', label: 'Customer Acquisition Cost (CAC) ($)', placeholder: 'e.g., 500' },
        { id: 'gross_margin', label: 'Gross Margin (%)', placeholder: 'e.g., 75' },
        { id: 'net_profit', label: 'Net Profit / EBITDA ($)', placeholder: 'e.g., 200000' },
        { id: 'burn_rate', label: 'Monthly Burn Rate ($)', placeholder: 'e.g., 25000' },
        { id: 'runway', label: 'Runway (Months)', placeholder: 'e.g., 12' }
      ].map((field) => (
        <div key={field.id}>
          <label className="block font-medium text-gray-700 mb-1">{field.label}</label>
          <input 
            type="number" 
            value={formData[field.id]} 
            onChange={(e) => updateFormData(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-2 border rounded focus:ring focus:ring-teal-400" 
          />
          {errors[field.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Step 3: Growth & Churn Rates
const Step3 = ({ formData, errors, updateFormData }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Growth and Churn Rates</h3>
    <p className="text-gray-600 mb-4 text-sm">
      Enter revenue growth and churn metrics.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { id: 'revenue_growth_yoy', label: 'Revenue Growth (YoY %)', placeholder: 'e.g., 20' },
        { id: 'revenue_growth_mom', label: 'Revenue Growth (MoM %)', placeholder: 'e.g., 3' },
        { id: 'customer_churn', label: 'Customer Churn Rate (%)', placeholder: 'e.g., 5' },
        { id: 'revenue_churn', label: 'Revenue Churn Rate (%)', placeholder: 'e.g., 4' }
      ].map((field) => (
        <div key={field.id}>
          <label className="block font-medium text-gray-700 mb-1">{field.label}</label>
          <input 
            type="number" 
            value={formData[field.id]} 
            onChange={(e) => updateFormData(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-2 border rounded focus:ring focus:ring-teal-400" 
          />
          {errors[field.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Step 4: Customer & Market Metrics
const Step4 = ({ formData, errors, updateFormData }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 4: Customer & Market Metrics</h3>
    <p className="text-gray-600 mb-4 text-sm">
      Provide customer and market details.
    </p>
    
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'active_customers', label: 'Active Customers', placeholder: 'e.g., 1500', type: 'number' },
          { id: 'monthly_active_users', label: 'Monthly Active Users (MAU)', placeholder: 'e.g., 2000', type: 'number' },
          { id: 'retention_rate', label: 'Retention Rate (%)', placeholder: 'e.g., 85', type: 'number' },
          { id: 'nps', label: 'Net Promoter Score (NPS)', placeholder: 'e.g., 70', type: 'number' }
        ].map((field) => (
          <div key={field.id}>
            <label className="block font-medium text-gray-700 mb-1">{field.label}</label>
            <input 
              type={field.type} 
              value={formData[field.id]} 
              onChange={(e) => updateFormData(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full p-2 border rounded focus:ring focus:ring-teal-400" 
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Customer Segment</label>
          <select 
            value={formData.customer_segment} 
            onChange={(e) => updateFormData('customer_segment', e.target.value)}
            className="w-full p-2 border rounded focus:ring focus:ring-teal-400"
          >
            <option value="">Select one</option>
            <option value="small-business">Small Businesses</option>
            <option value="mid-market">Mid-Market</option>
            <option value="enterprise">Enterprise</option>
            <option value="consumer">Consumer</option>
          </select>
          {errors.customer_segment && (
            <p className="text-red-500 text-sm mt-1">{errors.customer_segment}</p>
          )}
        </div>
        
        <div>
          <label className="block font-medium text-gray-700 mb-1">Buyer Type / Exit Potential</label>
          <select 
            value={formData.buyer_type} 
            onChange={(e) => updateFormData('buyer_type', e.target.value)}
            className="w-full p-2 border rounded focus:ring focus:ring-teal-400"
          >
            <option value="">Select one</option>
            <option value="investors">Investors</option>
            <option value="competitors">Competitors</option>
            <option value="strategic-partners">Strategic Partners</option>
            <option value="unknown">Unknown</option>
          </select>
          {errors.buyer_type && (
            <p className="text-red-500 text-sm mt-1">{errors.buyer_type}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ValuationForm;