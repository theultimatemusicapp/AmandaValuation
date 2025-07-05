import React from 'react';

// Blog Landing Component
export const BlogSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Latest Insights</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest trends in SaaS valuation, AI market insights, and business growth strategies.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Featured Blog Posts */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            How to Value Your SaaS Business in 2025
          </h3>
          <p className="text-gray-600 mb-4">By John Edwards | March 13, 2025</p>
          <p className="text-gray-600 mb-6">
            Learn key valuation methods and metrics for SaaS businesses, with insights on market trends and strategies to boost value.
          </p>
          <a 
            href="/blog/how-to-value-saas" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
          >
            Read More
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            AI Market Trends: Valuing AI-Driven Businesses
          </h3>
          <p className="text-gray-600 mb-4">By Ben Howard | April 15, 2025</p>
          <p className="text-gray-600 mb-6">
            Explore the booming AI market and learn how proprietary technology and growth metrics drive AI business valuations.
          </p>
          <a 
            href="/blog/valuing-ai-driven-trends" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
          >
            Read More
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Step-by-Step Guide to Selling Your Small Business
          </h3>
          <p className="text-gray-600 mb-4">By Josie Brosovic | May 01, 2025</p>
          <p className="text-gray-600 mb-6">
            Discover essential steps to prepare and sell your small business, with tips to maximize value and streamline the process.
          </p>
          <a 
            href="/blog/selling-your-small-business" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
          >
            Read More
          </a>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <a 
          href="/blog" 
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          View All Articles
        </a>
      </div>
    </div>
  </section>
);

// Full Blog Page Component
export const BlogPage = () => (
  <div className="min-h-screen bg-gray-50 pt-20">
    <div className="container mx-auto px-6 py-12">
      {/* Blog Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">SaaS Valuation Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore expert insights on SaaS valuation, AI market trends, and small business sales.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Blog Post 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            How to Value Your SaaS Business in 2025
          </h3>
          <p className="text-gray-600 mb-4">By John Edwards | March 13, 2025</p>
          <p className="text-gray-600 mb-6">
            Learn key valuation methods and metrics for SaaS businesses, with insights on market trends and strategies to boost value.
          </p>
          <a 
            href="/blog/how-to-value-saas" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
          >
            Read More
          </a>
        </div>

        {/* Blog Post 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            AI Market Trends: Valuing AI-Driven Businesses
          </h3>
          <p className="text-gray-600 mb-4">By Ben Howard | April 15, 2025</p>
          <p className="text-gray-600 mb-6">
            Explore the booming AI market and learn how proprietary technology and growth metrics drive AI business valuations.
          </p>
          <a 
            href="/blog/valuing-ai-driven-trends" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
          >
            Read More
          </a>
        </div>

        {/* Blog Post 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Step-by-Step Guide to Selling Your Small Business
          </h3>
          <p className="text-gray-600 mb-4">By Josie Brosovic | May 01, 2025</p>
          <p className="text-gray-600 mb-6">
            Discover essential steps to prepare and sell your small business, with tips to maximize value and streamline the process.
          </p>
          <a 
            href="/blog/selling-your-small-business" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
          >
            Read More
          </a>
        </div>

        {/* Blog Post 4 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Optimizing SaaS Churn: Strategies for Customer Retention
          </h3>
          <p className="text-gray-600 mb-4">By Sarah Lin | June 10, 2025</p>
          <p className="text-gray-600 mb-6">
            Dive into proven strategies to reduce churn in your SaaS business, from improving onboarding to leveraging customer feedback.
          </p>
          <a 
            href="/blog/strategies-for-customer-retention" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
          >
            Read More
          </a>
        </div>

        {/* Blog Post 5 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Scaling Your SaaS: Growth Tactics for 2025
          </h3>
          <p className="text-gray-600 mb-4">By Michael Chen | July 15, 2025</p>
          <p className="text-gray-600 mb-6">
            Explore actionable tactics to scale your SaaS business, including market expansion, pricing strategies, and team growth.
          </p>
          <a 
            href="/blog/grow-tactics-for-2025" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
          >
            Read More
          </a>
        </div>

        {/* Blog Post 6 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Mastering SaaS Pricing Models: Boost Revenue in 2025
          </h3>
          <p className="text-gray-600 mb-4">By Emily Rivera | August 20, 2025</p>
          <p className="text-gray-600 mb-6">
            Learn how to optimize your SaaS pricing model to maximize revenue, with insights on tiered pricing and value-based strategies.
          </p>
          <a 
            href="/blog/boost-saas-revenue" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
          >
            Read More
          </a>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="py-12 mt-16 bg-white rounded-lg shadow-lg">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                "SaaS Valuation App gave me a clear picture of my company's value in just 15 minutes. 
                The AI insights were a game-changer for our investor pitch!"
              </p>
              <p className="text-gray-800 font-semibold">John Edwards, Founder, TechTrend Innovations</p>
              <div className="flex mt-2">
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                "The data analysis feature made due diligence a breeze. I was able to securely get 
                AI-driven insights that impressed our investors."
              </p>
              <p className="text-gray-800 font-semibold">Ben Howard, CEO, CloudSync Solutions</p>
              <div className="flex mt-2">
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                "I love how SaaS Valuation App improves my understanding of business worth with AI-driven insights."
              </p>
              <p className="text-gray-800 font-semibold">Josie Brosovic, Founder, InnovateFlow</p>
              <div className="flex mt-2">
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-teal-500 to-gray-800 text-white py-12 rounded-lg mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Discover Your SaaS Value?</h2>
          <p className="mb-6">
            Join thousands of founders who trust SaaS Valuation App to understand their business worth and grow smarter.
          </p>
          <a 
            href="/" 
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            Get Started Now
          </a>
        </div>
      </section>
    </div>
  </div>
);