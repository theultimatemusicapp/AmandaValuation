import React from 'react';

// Step 5: Product & Technology
export const Step5 = ({ formData, errors, updateFormData }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 5: Product & Technology</h3>
    <p className="text-gray-600 mb-4 text-sm">
      Detail your product and tech maturity.
    </p>
    
    <div className="space-y-4">
      {[
        {
          id: 'product_market_fit',
          label: 'Product-Market Fit',
          options: [
            { value: 'none', label: 'None' },
            { value: 'early', label: 'Early Signs' },
            { value: 'strong', label: 'Strong Fit' },
            { value: 'fully-confirmed', label: 'Fully Confirmed' }
          ]
        },
        {
          id: 'proprietary_tech',
          label: 'Proprietary Technology / IP',
          options: [
            { value: 'none', label: 'No' },
            { value: 'patents', label: 'Patents Held' },
            { value: 'copyrights', label: 'Copyrights / Trade Secrets' },
            { value: 'both', label: 'Both' }
          ]
        },
        {
          id: 'code_quality',
          label: 'Code Quality Reviewed',
          options: [
            { value: 'no-review', label: 'No Review' },
            { value: 'internal-review', label: 'Internal Review' },
            { value: 'external-review', label: 'External Audit' }
          ]
        },
        {
          id: 'scalable_infrastructure',
          label: 'Scalable Infrastructure',
          options: [
            { value: 'no', label: 'No' },
            { value: 'partial', label: 'Partial' },
            { value: 'yes', label: 'Yes' }
          ]
        },
        {
          id: 'feature_release_frequency',
          label: 'Feature Release Frequency',
          options: [
            { value: 'rarely', label: 'Rarely' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'daily', label: 'Daily' }
          ]
        },
        {
          id: 'security_compliance',
          label: 'Security Compliance',
          options: [
            { value: 'none', label: 'None' },
            { value: 'gdpr', label: 'GDPR' },
            { value: 'iso27001', label: 'ISO 27001' },
            { value: 'other', label: 'Other' }
          ]
        }
      ].map((field) => (
        <div key={field.id}>
          <label className="block font-medium text-gray-700 mb-1">{field.label}</label>
          <select 
            value={formData[field.id]} 
            onChange={(e) => updateFormData(field.id, e.target.value)}
            className="w-full p-2 border rounded focus:ring focus:ring-teal-400"
          >
            <option value="">Select option</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors[field.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Step 6: Team & Operations
export const Step6 = ({ formData, errors, updateFormData }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 6: Team & Operations</h3>
    <p className="text-gray-600 mb-4 text-sm">
      Share team and operational details.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { id: 'fte', label: 'Full-Time Employees', placeholder: 'e.g., 25', type: 'number' },
        { id: 'key_staff', label: 'Founders / Key Staff', placeholder: 'e.g., 3', type: 'number' },
        { id: 'turnover_rate', label: 'Staff Turnover Rate (%)', placeholder: 'e.g., 5', type: 'number' },
        { id: 'eng_sales_ratio', label: 'Engineering to Sales Ratio', placeholder: 'e.g., 2.5', type: 'number' },
        { id: 'support_tickets', label: 'Support Tickets per Month', placeholder: 'e.g., 100', type: 'number' },
        { id: 'support_rating', label: 'Customer Support Rating (1-10)', placeholder: 'e.g., 8', type: 'number' },
        { id: 'headcount_growth', label: 'Headcount Growth Rate (%)', placeholder: 'e.g., 20', type: 'number' }
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
  </div>
);

// Step 7: Legal, Contracts & Risk
export const Step7 = ({ formData, errors, updateFormData }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 7: Legal, Contracts & Risk</h3>
    <p className="text-gray-600 mb-4 text-sm">
      Provide legal and risk details.
    </p>
    
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            id: 'legal_entity',
            label: 'Legal Entity Type',
            type: 'select',
            options: [
              { value: 'llc', label: 'LLC' },
              { value: 'c-corp', label: 'C-Corp' },
              { value: 's-corp', label: 'S-Corp' },
              { value: 'other', label: 'Other' }
            ]
          },
          {
            id: 'ip_ownership',
            label: 'IP Ownership Status',
            type: 'select',
            options: [
              { value: 'fully-owned', label: 'Fully Owned' },
              { value: 'partial', label: 'Partially Owned' },
              { value: 'third-party', label: 'Third-Party Licensed' }
            ]
          },
          {
            id: 'contract_length',
            label: 'Average Customer Contract Length (Months)',
            type: 'number',
            placeholder: 'e.g., 12'
          },
          {
            id: 'contract_value',
            label: 'Average Contract Value (ACV) ($)',
            type: 'number',
            placeholder: 'e.g., 12000'
          },
          {
            id: 'vendor_lockin',
            label: 'Vendor Lock-In',
            type: 'select',
            options: [
              { value: 'none', label: 'None' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'high', label: 'High' }
            ]
          },
          {
            id: 'legal_issues',
            label: 'Pending Legal Issues',
            type: 'select',
            options: [
              { value: 'none', label: 'None' },
              { value: 'minor', label: 'Minor' },
              { value: 'major', label: 'Major' }
            ]
          },
          {
            id: 'data_privacy',
            label: 'Data Privacy Compliance',
            type: 'select',
            options: [
              { value: 'full', label: 'Fully Compliant' },
              { value: 'partial', label: 'Partially Compliant' },
              { value: 'none', label: 'Not Compliant' }
            ]
          },
          {
            id: 'cyber_insurance',
            label: 'Cybersecurity Insurance',
            type: 'select',
            options: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]
          },
          {
            id: 'debt_level',
            label: 'Debt Level ($)',
            type: 'number',
            placeholder: 'e.g., 50000'
          }
        ].map((field) => (
          <div key={field.id}>
            <label className="block font-medium text-gray-700 mb-1">{field.label}</label>
            {field.type === 'select' ? (
              <select 
                value={formData[field.id]} 
                onChange={(e) => updateFormData(field.id, e.target.value)}
                className="w-full p-2 border rounded focus:ring focus:ring-teal-400"
              >
                <option value="">Select option</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input 
                type={field.type} 
                value={formData[field.id]} 
                onChange={(e) => updateFormData(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-2 border rounded focus:ring focus:ring-teal-400" 
              />
            )}
            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);