import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Enhanced Results Section with Actionable Advice
export const EnhancedResultsSection = ({ valuationResult }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const valuationChartRef = useRef(null);
  const metricsChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const valuationChartInstance = useRef(null);
  const metricsChartInstance = useRef(null);
  const comparisonChartInstance = useRef(null);

  // Initialize charts
  useEffect(() => {
    if (!valuationResult) return;

    // Valuation Methods Comparison Chart
    if (valuationChartRef.current) {
      if (valuationChartInstance.current) {
        valuationChartInstance.current.destroy();
      }

      const ctx = valuationChartRef.current.getContext('2d');
      valuationChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(valuationResult.methods || {}),
          datasets: [{
            label: 'Valuation ($)',
            data: Object.values(valuationResult.methods || {}).map(method => method.value),
            backgroundColor: [
              'rgba(56, 178, 172, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(147, 51, 234, 0.8)',
              'rgba(34, 197, 94, 0.8)'
            ],
            borderColor: [
              'rgba(56, 178, 172, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(147, 51, 234, 1)',
              'rgba(34, 197, 94, 1)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Valuation by Method',
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + (value / 1000000).toFixed(1) + 'M';
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Industry Comparison Chart
    if (comparisonChartRef.current) {
      if (comparisonChartInstance.current) {
        comparisonChartInstance.current.destroy();
      }

      const ctx = comparisonChartRef.current.getContext('2d');
      const industryAverage = valuationResult.average_valuation * 0.85; // Mock industry average
      const topPerformer = valuationResult.average_valuation * 1.4; // Mock top performer

      comparisonChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Your Business', 'Industry Average', 'Top 10%'],
          datasets: [{
            label: 'Valuation ($)',
            data: [
              valuationResult.average_valuation,
              industryAverage,
              topPerformer
            ],
            backgroundColor: [
              'rgba(56, 178, 172, 0.8)',
              'rgba(156, 163, 175, 0.8)',
              'rgba(34, 197, 94, 0.8)'
            ],
            borderColor: [
              'rgba(56, 178, 172, 1)',
              'rgba(156, 163, 175, 1)',
              'rgba(34, 197, 94, 1)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Industry Comparison',
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + (value / 1000000).toFixed(1) + 'M';
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Key Metrics Radar Chart
    if (metricsChartRef.current) {
      if (metricsChartInstance.current) {
        metricsChartInstance.current.destroy();
      }

      const ctx = metricsChartRef.current.getContext('2d');
      metricsChartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Growth Rate', 'Profit Margin', 'Customer Health', 'Market Position', 'Operational Efficiency'],
          datasets: [{
            label: 'Your Business',
            data: [
              Math.min(valuationResult.growth_score || 70, 100),
              Math.min(valuationResult.profitability_score || 65, 100),
              Math.min(valuationResult.customer_score || 80, 100),
              Math.min(valuationResult.market_score || 75, 100),
              Math.min(valuationResult.operational_score || 70, 100)
            ],
            backgroundColor: 'rgba(56, 178, 172, 0.2)',
            borderColor: 'rgba(56, 178, 172, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(56, 178, 172, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(56, 178, 172, 1)'
          }, {
            label: 'Industry Average',
            data: [60, 55, 65, 60, 65],
            backgroundColor: 'rgba(156, 163, 175, 0.1)',
            borderColor: 'rgba(156, 163, 175, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(156, 163, 175, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(156, 163, 175, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Performance vs Industry',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20
              }
            }
          }
        }
      });
    }

    return () => {
      if (valuationChartInstance.current) valuationChartInstance.current.destroy();
      if (metricsChartInstance.current) metricsChartInstance.current.destroy();
      if (comparisonChartInstance.current) comparisonChartInstance.current.destroy();
    };
  }, [valuationResult]);

  // Generate PDF Report
  const generatePDFReport = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Add title page
      doc.setFillColor(56, 178, 172);
      doc.rect(0, 0, 210, 60, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Professional SaaS Valuation Report', 105, 30, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 45, { align: 'center' });

      // Reset colors
      doc.setTextColor(0, 0, 0);
      
      // Executive Summary
      let yPos = 80;
      doc.setFontSize(18);
      doc.setTextColor(56, 178, 172);
      doc.text('Executive Summary', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      const summaryText = `Business Valuation: $${Math.round(valuationResult.average_valuation).toLocaleString()}
      
Your SaaS business demonstrates ${valuationResult.confidence_score >= 80 ? 'strong' : 'moderate'} fundamentals with a confidence score of ${valuationResult.confidence_score}%. 

Key Strengths:
• ${getTopStrengths(valuationResult).join('\n• ')}

Areas for Improvement:
• ${getImprovementAreas(valuationResult).join('\n• ')}`;

      const lines = doc.splitTextToSize(summaryText, 170);
      lines.forEach(line => {
        doc.text(line, 20, yPos);
        yPos += 6;
      });

      // Add new page for detailed analysis
      doc.addPage();
      yPos = 20;

      // Valuation Methods
      doc.setFontSize(16);
      doc.setTextColor(56, 178, 172);
      doc.text('Valuation Analysis', 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      Object.entries(valuationResult.methods || {}).forEach(([method, data]) => {
        doc.text(`${method}: $${Math.round(data.value).toLocaleString()}`, 20, yPos);
        yPos += 6;
        
        const explanationLines = doc.splitTextToSize(data.explanation || 'No explanation available.', 170);
        explanationLines.forEach(line => {
          doc.text(line, 25, yPos);
          yPos += 5;
        });
        yPos += 5;
      });

      // Add charts as images
      if (valuationChartRef.current) {
        try {
          const chartImage = valuationChartRef.current.toDataURL('image/png');
          doc.addPage();
          doc.text('Valuation Methods Comparison', 20, 20);
          doc.addImage(chartImage, 'PNG', 20, 30, 170, 100);
        } catch (error) {
          console.warn('Could not add valuation chart to PDF:', error);
        }
      }

      if (comparisonChartRef.current) {
        try {
          const comparisonImage = comparisonChartRef.current.toDataURL('image/png');
          doc.addPage();
          doc.text('Industry Comparison', 20, 20);
          doc.addImage(comparisonImage, 'PNG', 20, 30, 170, 100);
        } catch (error) {
          console.warn('Could not add comparison chart to PDF:', error);
        }
      }

      // Add recommendations
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(56, 178, 172);
      doc.text('Actionable Recommendations', 20, 20);
      
      yPos = 35;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      const recommendations = getActionableRecommendations(valuationResult);
      recommendations.forEach((rec, index) => {
        doc.text(`${index + 1}. ${rec.title}`, 20, yPos);
        yPos += 8;
        
        const recLines = doc.splitTextToSize(rec.description, 170);
        recLines.forEach(line => {
          doc.text(line, 25, yPos);
          yPos += 5;
        });
        yPos += 5;
      });

      // Footer on all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`SaaSVal Professional Report - Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }

      // Save the PDF
      doc.save(`SaaS_Valuation_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Helper functions for actionable advice
  const getTopStrengths = (result) => {
    const strengths = [];
    if (result.growth_score >= 75) strengths.push('Strong revenue growth trajectory');
    if (result.customer_score >= 75) strengths.push('Healthy customer retention metrics');
    if (result.profitability_score >= 70) strengths.push('Solid profit margins');
    if (result.market_score >= 75) strengths.push('Strong market position');
    return strengths.length > 0 ? strengths : ['Stable business fundamentals'];
  };

  const getImprovementAreas = (result) => {
    const areas = [];
    if (result.growth_score < 60) areas.push('Focus on accelerating revenue growth');
    if (result.customer_score < 65) areas.push('Improve customer retention and reduce churn');
    if (result.profitability_score < 60) areas.push('Optimize operational efficiency and margins');
    if (result.operational_score < 65) areas.push('Streamline operations and reduce dependencies');
    return areas.length > 0 ? areas : ['Continue optimizing current strategies'];
  };

  const getActionableRecommendations = (result) => {
    const recommendations = [];
    
    if (result.growth_score < 70) {
      recommendations.push({
        title: 'Accelerate Growth',
        description: 'Focus on increasing your revenue growth rate through expanded marketing efforts, new customer acquisition channels, or product line extensions. Consider implementing a referral program or partnership strategy.'
      });
    }

    if (result.customer_score < 70) {
      recommendations.push({
        title: 'Improve Customer Retention',
        description: 'Implement customer success programs, improve onboarding processes, and conduct regular customer health checks. Consider introducing annual contracts or loyalty programs to reduce churn.'
      });
    }

    if (result.profitability_score < 65) {
      recommendations.push({
        title: 'Optimize Profitability',
        description: 'Review your cost structure and identify areas for efficiency improvements. Consider automating manual processes, optimizing your pricing strategy, or reducing customer acquisition costs.'
      });
    }

    recommendations.push({
      title: 'Prepare for Exit',
      description: 'Document all processes, ensure financial records are audit-ready, and consider building strategic partnerships that could attract potential acquirers. Focus on reducing key person dependencies.'
    });

    return recommendations;
  };

  if (!valuationResult) {
    return <div>Loading results...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Professional Valuation Report</h1>
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-6 rounded-xl inline-block">
            <div className="text-3xl font-bold">${Math.round(valuationResult.average_valuation).toLocaleString()}</div>
            <div className="text-lg opacity-90">Estimated Business Value</div>
            <div className="text-sm opacity-75">Confidence Score: {valuationResult.confidence_score}%</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
              { id: 'analysis', label: 'Detailed Analysis', icon: 'fas fa-microscope' },
              { id: 'recommendations', label: 'Recommendations', icon: 'fas fa-lightbulb' },
              { id: 'comparisons', label: 'Comparisons', icon: 'fas fa-balance-scale' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-teal-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { 
                  title: 'Valuation Range', 
                  value: `$${Math.round(valuationResult.average_valuation * 0.85).toLocaleString()} - $${Math.round(valuationResult.average_valuation * 1.15).toLocaleString()}`,
                  icon: 'fas fa-chart-line',
                  color: 'teal'
                },
                { 
                  title: 'Revenue Multiple', 
                  value: `${(valuationResult.average_valuation / (valuationResult.arr || 1000000)).toFixed(1)}x`,
                  icon: 'fas fa-times',
                  color: 'blue'
                },
                { 
                  title: 'Growth Score', 
                  value: `${valuationResult.growth_score || 75}/100`,
                  icon: 'fas fa-arrow-up',
                  color: 'green'
                },
                { 
                  title: 'Risk Level', 
                  value: valuationResult.confidence_score >= 80 ? 'Low' : valuationResult.confidence_score >= 60 ? 'Medium' : 'High',
                  icon: 'fas fa-shield-alt',
                  color: valuationResult.confidence_score >= 80 ? 'green' : valuationResult.confidence_score >= 60 ? 'yellow' : 'red'
                }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className={`text-3xl mb-2 text-${metric.color}-500`}>
                    <i className={metric.icon}></i>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.title}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div style={{ height: '300px' }}>
                  <canvas ref={valuationChartRef}></canvas>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div style={{ height: '300px' }}>
                  <canvas ref={metricsChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Valuation Analysis</h2>
            
            <div className="space-y-6">
              {Object.entries(valuationResult.methods || {}).map(([method, data]) => (
                <div key={method} className="border-l-4 border-teal-500 pl-6 py-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{method}</h3>
                    <span className="text-2xl font-bold text-teal-600">
                      ${Math.round(data.value).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{data.explanation}</p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Value Range</div>
                      <div className="font-semibold">
                        ${Math.round(data.range?.[0] || data.value * 0.9).toLocaleString()} - 
                        ${Math.round(data.range?.[1] || data.value * 1.1).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Confidence Level</div>
                      <div className="font-semibold">
                        {data.confidence >= 80 ? 'High' : data.confidence >= 60 ? 'Medium' : 'Moderate'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Actionable Recommendations</h2>
            
            <div className="space-y-6">
              {getActionableRecommendations(valuationResult).map((rec, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg border-l-4 border-teal-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    <i className="fas fa-lightbulb text-teal-500 mr-2"></i>
                    {rec.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                <i className="fas fa-map-marked-alt text-yellow-600 mr-2"></i>
                Next Steps
              </h3>
              <ul className="space-y-2 text-yellow-700">
                <li>• Implement the top 2-3 recommendations based on your priorities</li>
                <li>• Set up monthly tracking for key metrics mentioned in this report</li>
                <li>• Consider hiring a financial advisor for exit planning</li>
                <li>• Re-run this valuation quarterly to track improvements</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'comparisons' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div style={{ height: '400px' }}>
                <canvas ref={comparisonChartRef}></canvas>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Industry Benchmarks</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">Your Position</div>
                  <div className="text-sm text-gray-500 mt-2">
                    {valuationResult.average_valuation > (valuationResult.average_valuation * 0.85) * 1.2 ? 'Top 25%' : 
                     valuationResult.average_valuation > (valuationResult.average_valuation * 0.85) ? 'Above Average' : 'Below Average'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">Growth Potential</div>
                  <div className="text-sm text-gray-500 mt-2">
                    ${Math.round((valuationResult.average_valuation * 1.4) - valuationResult.average_valuation).toLocaleString()} upside
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">Time to Top 10%</div>
                  <div className="text-sm text-gray-500 mt-2">
                    {valuationResult.growth_score >= 75 ? '12-18 months' : '18-24 months'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={generatePDFReport}
            disabled={isGeneratingPDF}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </span>
            ) : (
              <>
                <i className="fas fa-download mr-2"></i>
                Download Full Report (PDF)
              </>
            )}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
          >
            <i className="fas fa-redo mr-2"></i>
            New Valuation
          </button>
        </div>
      </div>
    </div>
  );
};