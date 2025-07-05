import React, { useEffect, useRef, useState } from 'react';

export const ResultsSection = ({ valuationResult }) => {
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const valuationChartRef = useRef(null);
  const financialChartRef = useRef(null);
  const growthChartRef = useRef(null);
  const riskChartRef = useRef(null);

  // Load Chart.js dynamically
  useEffect(() => {
    const loadChartJS = async () => {
      if (window.Chart) {
        setChartsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        setChartsLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadChartJS();
  }, []);

  // Create charts when Chart.js is loaded
  useEffect(() => {
    if (!chartsLoaded || !valuationResult) return;

    const createCharts = () => {
      // Valuation Methods Chart
      if (valuationChartRef.current) {
        new window.Chart(valuationChartRef.current, {
          type: 'bar',
          data: {
            labels: valuationResult.valuations.map(v => v.method),
            datasets: [{
              label: 'Valuation ($)',
              data: valuationResult.valuations.map(v => v.value),
              backgroundColor: ['#38b2ac', '#f6ad55', '#4299e1', '#9f7aea'],
              borderColor: ['#319795', '#ed8936', '#3182ce', '#805ad5'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }

      // Financial Metrics Chart
      if (financialChartRef.current && valuationResult.charts_data?.financial_chart) {
        const financialData = valuationResult.charts_data.financial_chart;
        new window.Chart(financialChartRef.current, {
          type: 'bar',
          data: {
            labels: financialData.labels,
            datasets: [{
              label: 'Amount ($)',
              data: financialData.values,
              backgroundColor: financialData.colors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }

      // Growth Chart
      if (growthChartRef.current && valuationResult.charts_data?.growth_chart) {
        const growthData = valuationResult.charts_data.growth_chart;
        new window.Chart(growthChartRef.current, {
          type: 'bar',
          data: {
            labels: growthData.labels,
            datasets: [{
              label: 'Percentage (%)',
              data: growthData.values,
              backgroundColor: growthData.colors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }

      // Risk Chart
      if (riskChartRef.current && valuationResult.charts_data?.risk_chart) {
        const riskData = valuationResult.charts_data.risk_chart;
        new window.Chart(riskChartRef.current, {
          type: 'radar',
          data: {
            labels: riskData.labels,
            datasets: [{
              label: 'Risk Score (0-10)',
              data: riskData.values,
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderColor: 'rgba(239, 68, 68, 1)',
              pointBackgroundColor: 'rgba(239, 68, 68, 1)',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            scales: {
              r: {
                min: 0,
                max: 10,
                ticks: {
                  stepSize: 2
                }
              }
            }
          }
        });
      }
    };

    // Delay chart creation to ensure DOM is ready
    setTimeout(createCharts, 100);
  }, [chartsLoaded, valuationResult]);

  const downloadPDF = async () => {
    // Load jsPDF dynamically
    if (!window.jspdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;

    // Header
    doc.setFillColor(56, 178, 172);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('SaaSVal Professional Report', margin, 10);

    // Title Page
    yPos = 25;
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('SaaS Valuation Report', margin, yPos);
    
    yPos += 15;
    doc.setFontSize(12);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40, 'F');
    doc.setDrawColor(56, 178, 172);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40);
    
    yPos += 10;
    doc.text(`Valuation: $${Math.round(valuationResult.average_valuation).toLocaleString()}`, margin + 5, yPos);
    yPos += 10;
    doc.text(`Range: $${Math.round(valuationResult.valuation_range.low).toLocaleString()} - $${Math.round(valuationResult.valuation_range.high).toLocaleString()}`, margin + 5, yPos);
    yPos += 10;
    doc.text(`Confidence: ${Math.round(valuationResult.confidence_score)}%`, margin + 5, yPos);
    yPos += 15;
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPos);

    // Valuation Methods Page
    doc.addPage();
    yPos = 25;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Valuation Methods', margin, yPos);
    
    yPos += 15;
    valuationResult.valuations.forEach((v) => {
      doc.setFontSize(12);
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
      doc.setDrawColor(56, 178, 172);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 25);
      
      yPos += 8;
      doc.text(`${v.method}: $${Math.round(v.value).toLocaleString()}`, margin + 5, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.text(v.explanation || 'Calculated using industry standards', margin + 5, yPos);
      yPos += 15;
    });

    // Insights Page
    if (valuationResult.insights) {
      doc.addPage();
      yPos = 25;
      doc.setFontSize(16);
      doc.text('Key Insights & Recommendations', margin, yPos);
      
      yPos += 15;
      if (valuationResult.insights.strengths?.length > 0) {
        doc.setFontSize(14);
        doc.text('Strengths:', margin, yPos);
        yPos += 10;
        doc.setFontSize(10);
        valuationResult.insights.strengths.forEach((strength) => {
          doc.text(`• ${strength}`, margin + 5, yPos);
          yPos += 8;
        });
        yPos += 5;
      }
      
      if (valuationResult.insights.improvements?.length > 0) {
        doc.setFontSize(14);
        doc.text('Areas for Improvement:', margin, yPos);
        yPos += 10;
        doc.setFontSize(10);
        valuationResult.insights.improvements.forEach((improvement) => {
          doc.text(`• ${improvement}`, margin + 5, yPos);
          yPos += 8;
        });
        yPos += 5;
      }
      
      if (valuationResult.insights.recommendations?.length > 0) {
        doc.setFontSize(14);
        doc.text('Recommendations:', margin, yPos);
        yPos += 10;
        doc.setFontSize(10);
        valuationResult.insights.recommendations.forEach((rec) => {
          doc.text(`• ${rec}`, margin + 5, yPos);
          yPos += 8;
        });
      }
    }

    doc.save('saas_valuation_report.pdf');
  };

  if (!valuationResult) {
    return (
      <div className="py-16 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-teal-500 mb-4"></i>
        <p>Loading your valuation results...</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your SaaS Valuation Results</h1>
          <p className="text-gray-600 mb-6">
            Comprehensive analysis based on your business metrics and industry benchmarks.
          </p>
        </div>

        {/* Main Valuation Display */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-teal-600 mb-2">
              ${Math.round(valuationResult.average_valuation).toLocaleString()}
            </div>
            <p className="text-gray-600">
              Estimated Valuation Range: ${Math.round(valuationResult.valuation_range.low).toLocaleString()} - ${Math.round(valuationResult.valuation_range.high).toLocaleString()}
            </p>
            <p className="text-gray-600">
              Confidence Score: <span className="font-semibold text-teal-600">{Math.round(valuationResult.confidence_score)}%</span>
            </p>
          </div>

          {/* Valuation Grade */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full">
              <i className="fas fa-award mr-2"></i>
              Valuation Grade: {valuationResult.insights?.valuation_grade || 'B'}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Valuation by Method</h3>
            <canvas ref={valuationChartRef} width="400" height="300"></canvas>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Metrics</h3>
            <canvas ref={financialChartRef} width="400" height="300"></canvas>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth vs Churn</h3>
            <canvas ref={growthChartRef} width="400" height="300"></canvas>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Assessment</h3>
            <canvas ref={riskChartRef} width="400" height="300"></canvas>
          </div>
        </div>

        {/* Insights Section */}
        {valuationResult.insights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {valuationResult.insights.strengths?.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  <i className="fas fa-thumbs-up mr-2"></i>Strengths
                </h3>
                <ul className="space-y-2">
                  {valuationResult.insights.strengths.map((strength, index) => (
                    <li key={index} className="text-green-700 text-sm">• {strength}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {valuationResult.insights.improvements?.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                  <i className="fas fa-exclamation-triangle mr-2"></i>Improvements
                </h3>
                <ul className="space-y-2">
                  {valuationResult.insights.improvements.map((improvement, index) => (
                    <li key={index} className="text-yellow-700 text-sm">• {improvement}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {valuationResult.insights.recommendations?.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  <i className="fas fa-lightbulb mr-2"></i>Recommendations
                </h3>
                <ul className="space-y-2">
                  {valuationResult.insights.recommendations.map((rec, index) => (
                    <li key={index} className="text-blue-700 text-sm">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Method Explanations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Valuation Method Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valuationResult.valuations.map((valuation, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">{valuation.method}</h4>
                <p className="text-2xl font-bold text-teal-600 mb-2">
                  ${Math.round(valuation.value).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {valuation.explanation || 'Calculated using industry-standard methodologies'}
                </p>
                {valuation.multiplier && (
                  <p className="text-xs text-gray-500 mt-2">
                    Multiplier: {valuation.multiplier}x
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Download Section */}
        <div className="text-center">
          <button
            onClick={downloadPDF}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
          >
            <i className="fas fa-download mr-2"></i>
            Download Full Report (PDF)
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Professional report with all charts and detailed analysis
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;