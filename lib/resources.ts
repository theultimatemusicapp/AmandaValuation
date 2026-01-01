export interface Resource {
    id: string;
    title: string;
    description: string;
    category: 'Guide' | 'Market' | 'Metrics' | 'Exit';
    author: string;
    date: string;
    readTime: string;
    content: string;
    image?: string;
}

export const RESOURCES: Resource[] = [
    {
        id: 'rule-of-40',
        title: 'The Rule of 40 in SaaS Explained',
        description: 'Balance growth and profitability with this key industry metric. Learn why investors prize companies that hit the 40% benchmark.',
        category: 'Metrics',
        author: 'Michael Chen',
        date: 'Aug 19, 2025',
        readTime: '6 min read',
        content: `
            <h3>What Is the Rule of 40?</h3>
            <p>Add your year-over-year revenue growth percentage to your profit margin. A combined score of 40 or higher shows that you are scaling efficiently. Public SaaS leaders typically sit between 35% and 60%, while bootstrapped products often post lower growth with higher margins.</p>
            
            <div class="overflow-x-auto my-6">
                <table class="min-w-full text-left border-collapse">
                    <thead class="bg-slate-50">
                        <tr>
                            <th class="py-2 px-3 border-b">Company Type</th>
                            <th class="py-2 px-3 border-b">Growth</th>
                            <th class="py-2 px-3 border-b">Profit</th>
                            <th class="py-2 px-3 border-b">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="py-2 px-3 border-b">Bootstrapped</td>
                            <td class="py-2 px-3 border-b">20%</td>
                            <td class="py-2 px-3 border-b">18%</td>
                            <td class="py-2 px-3 border-b font-bold">38</td>
                        </tr>
                        <tr>
                            <td class="py-2 px-3 border-b">VC-Backed</td>
                            <td class="py-2 px-3 border-b">45%</td>
                            <td class="py-2 px-3 border-b">-5%</td>
                            <td class="py-2 px-3 border-b font-bold">40</td>
                        </tr>
                        <tr>
                            <td class="py-2 px-3 border-b">Efficient</td>
                            <td class="py-2 px-3 border-b">32%</td>
                            <td class="py-2 px-3 border-b">15%</td>
                            <td class="py-2 px-3 border-b font-bold font-bold">47</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Why It Matters</h3>
            <p>The metric gives investors a quick snapshot of risk. Fast-growing but unprofitable companies can still meet the Rule of 40, while slow-growth firms need stronger margins. Brokers use it as a screening tool to segment deal flow and to benchmark your efficiency against similar ARR bands.</p>
            
            <h3>How to Improve Your Score</h3>
            <p>Boost retention, optimize pricing, and streamline operations to increase both growth and profitability. Even a few points improvement can raise your valuation multiple. Pair leading indicators (pipeline velocity, activation rates) with lagging indicators (LTV, net revenue retention) to prioritize the fastest lifts.</p>
            
            <h3>Rule of 40 Scenarios to Model</h3>
            <ul>
                <li><strong>Efficiency sprint:</strong> Freeze headcount for one quarter, automate support workflows, and target a 5-point margin lift without slowing net new ARR.</li>
                <li><strong>Premiumization:</strong> Add usage-based add-ons and price localization to unlock 10% ARPU expansion while holding churn steady.</li>
                <li><strong>Retention-first:</strong> Launch a customer health score, re-engagement emails, and quarterly business reviews to move gross churn below 3% monthly.</li>
            </ul>
        `
    },
    {
        id: 'ai-valuation-bubble',
        title: 'The AI SaaS Valuation Bubble',
        description: 'Why "AI-powered" positioning is losing its premium and how buyers are now bucketing AI products for acquisition.',
        category: 'Market',
        author: 'Amanda White',
        date: 'Aug 26, 2025',
        readTime: '7 min read',
        content: `
            <p>For much of the past two years, adding the phrase “AI-powered” to a SaaS product felt like an act of financial alchemy. Founders rewrote landing pages, updated pitch decks, and reframed ordinary automation as intelligence, and in many cases the market rewarded them for it.</p>
            
            <h3>When AI Lost Its Shock Value</h3>
            <p>The problem is not that AI failed to deliver. The problem is that it succeeded too quickly. Within a short span of time, nearly every SaaS product began to look similar on the surface. Chatbots appeared in dashboards. Automated summaries showed up in reporting tools. Predictive insights became standard demo features. What once felt novel became expected, and what is expected rarely commands a valuation premium.</p>
            
            <h3>Why Buyers Mentally Sort AI SaaS Companies</h3>
            <ul>
                <li><strong>AI-augmented SaaS:</strong> Traditional products with AI features that improve usability or efficiency. Treated like any other solid SaaS with helpful extras.</li>
                <li><strong>AI for outcomes without a moat:</strong> Automation and prediction help, but competitors can replicate the same functionality using shared models. Little premium attached.</li>
                <li><strong>AI inseparable from value:</strong> Products powered by proprietary data, feedback loops, and scale effects. This is where valuation premiums still live—if proof is clear.</li>
            </ul>

            <h3>The End of the Free Pass</h3>
            <p>Artificial intelligence is not losing relevance. What is disappearing is the assumption that its presence alone justifies a higher price. Buyers now use AI as a lens on fundamentals—not a substitute for them.</p>
            
            <p><strong>Bottom line:</strong> 2026 will be the year of "AI Utility" over "AI Novelty". If your product doesn't solve a core pain point fundamentally better than non-AI tools, the premium will evaporate.</p>
        `
    },
    {
        id: 'micro-saas-valuation',
        title: 'Micro-SaaS Valuation: Under $1M ARR',
        description: 'Small doesn’t mean small multiples. Strategies for making your sub-$1M ARR business attractive to acquirers.',
        category: 'Exit',
        author: 'Amanda White',
        date: 'Jan 15, 2026',
        readTime: '5 min read',
        content: `
            <h3>Typical Micro-SaaS Multiples</h3>
            <p>For businesses between $100k and $1M ARR, buyers focus on stability and ease of ownership:</p>
            <ul>
                <li><strong>2x–4x ARR</strong> for profitable, low-complexity tools with low churn.</li>
                <li><strong>1.5x–3x ARR</strong> if revenue is tied to one channel or founder-only support.</li>
                <li><strong>4x–6x SDE</strong> when margins and documentation are strong.</li>
            </ul>
            
            <h3>What Buyers Love</h3>
            <p>At the sub-$1M level, acquirers often look for products they can "set and forget" or grow with minimal operational overhead.</p>
            <ul>
                <li>Simple onboarding with low support tickets.</li>
                <li>Diverse customer base (no logo above 10%).</li>
                <li>Clear pricing page with annual options.</li>
                <li>Automated billing, backups, and monitoring.</li>
            </ul>
            
            <h3>Common Risks to Mitigate</h3>
            <ul>
                <li>Dependence on a single API or platform policy.</li>
                <li>Founder-coded stack with no documentation.</li>
                <li>Seasonal revenue swings without reserves.</li>
                <li>Limited growth channels beyond word of mouth.</li>
            </ul>

            <p><strong>Growth Tip:</strong> Even a tiny micro-SaaS can see a 0.5x multiple bump just by having a documented SOP (Standard Operating Procedure) for support and maintenance.</p>
        `
    },
    {
        id: 'valuation-calculator-explained',
        title: 'SaaS Exit Calculator Logic',
        description: 'Understand the math behind valuation tools and how to sanity-check your exit numbers before negotiating.',
        category: 'Guide',
        author: 'Amanda White',
        date: 'Jan 15, 2026',
        readTime: '4 min read',
        content: `
            <h3>What Inputs Matter Most</h3>
            <p>Great calculators don’t just multiply ARR. They weight the drivers buyers care about:</p>
            <ul>
                <li>ARR or MRR trend, including seasonality.</li>
                <li>Logo churn vs. revenue churn for the last 12 months.</li>
                <li>Customer concentration, contract terms, and billing cadence.</li>
                <li>Gross margin and support load to estimate SDE.</li>
            </ul>
            
            <h3>How to Sanity-Check Results</h3>
            <p>Don't take any single number as gospel. Use these benchmarks to see if your calculator result is in "the zone":</p>
            <ul>
                <li>Compare the implied multiple to recent brokered deals in your niche.</li>
                <li>Stress test churn and CAC payback to see sensitivity.</li>
                <li>Benchmark gross margin and support ratios against peers.</li>
                <li>Ask “who will buy this?” and match the profile (PE, strategic, individual).</li>
            </ul>

            <h3>Turning Logic into a Narrative</h3>
            <p>A calculator gives you a number; a story gives you a deal. Use the data to explain *why* your multiple is what it is. If you have low churn, highlight the customer loyalty. If you have high growth, highlight the market demand.</p>
        `
    },
    {
        id: 'how-to-value-saas',
        title: 'Master Guide: How to Value a SaaS',
        description: 'The definitive framework for valuing subscription businesses, from revenue multiples to discounted cash flows.',
        category: 'Guide',
        author: 'Amanda White',
        date: 'Jul 12, 2025',
        readTime: '12 min read',
        content: `
            <h3>Market Overview in 2025</h3>
            <p>The global SaaS market reached a valuation of $247 billion in 2025, with projections estimating a rise to $908.21 billion by 2030. Driven by a compound annual growth rate (CAGR) of 18.7% from 2024 to 2030. Marc Andreessen’s famous assertion that "software is eating the world" remains relevant.</p>
            
            <div class="overflow-x-auto my-6">
                <table class="min-w-full text-left border-collapse">
                    <thead class="bg-slate-50">
                        <tr>
                            <th class="py-2 px-3 border-b">ARR Band</th>
                            <th class="py-2 px-3 border-b">Growth</th>
                            <th class="py-2 px-3 border-b">Rule of 40</th>
                            <th class="py-2 px-3 border-b">EV/ARR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="py-2 px-3 border-b">$500k–$1M</td>
                            <td class="py-2 px-3 border-b">20–35%</td>
                            <td class="py-2 px-3 border-b">30s</td>
                            <td class="py-2 px-3 border-b">2.5x–4x</td>
                        </tr>
                        <tr>
                            <td class="py-2 px-3 border-b">$1M–$5M</td>
                            <td class="py-2 px-3 border-b">30–55%</td>
                            <td class="py-2 px-3 border-b">40s</td>
                            <td class="py-2 px-3 border-b">4x–7x</td>
                        </tr>
                        <tr>
                            <td class="py-2 px-3 border-b">$5M+</td>
                            <td class="py-2 px-3 border-b">35–70%</td>
                            <td class="py-2 px-3 border-b">50+</td>
                            <td class="py-2 px-3 border-b">7x–12x</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Valuation Methods for SaaS Businesses</h3>
            <p>Valuing a SaaS business in 2025 remains a hot topic, blending art and science. For businesses under $5 million, SDE is common, adding back owner salaries to reflect true earnings. Larger firms shift to EBITDA, while growing SaaS companies often rely on revenue multiples.</p>
            
            <h3>Key SaaS Metrics and Multiples</h3>
            <p>SaaS valuations typically range from 4x to 10x annual profit (SDE), influenced by metrics like business age, owner involvement, and growth trends. An LTV/CAC ratio of 3 is ideal, ensuring marketing ROI. Net Revenue Retention (NRR) above 100% is the gold standard for high multiples.</p>
            
            <h3>Boosting Your SaaS Value</h3>
            <ul>
                <li><strong>Reduce Churn:</strong> Improve onboarding and add proactive success playbooks.</li>
                <li><strong>Outsource Maintenance:</strong> Free up founder time to increase "transferability".</li>
                <li><strong>Secure IP:</strong> Ensure all code and trademarks are properly owned by the entity.</li>
            </ul>
        `
    },
    {
        id: 'free-valuation-calculator',
        title: 'Free Valuation Calculator: How it Works',
        description: 'A deep dive into the methodology behind our free valuation tool. Learn how we weight growth, churn, and margins.',
        category: 'Guide',
        author: 'Michael Chen',
        date: 'Oct 12, 2025',
        readTime: '4 min read',
        content: `
            <h3>Methodology Overview</h3>
            <p>Our free valuation tool uses a "Revenue Multiple" approach, adjusted for your specific growth and churn profiles. Unlike basic calculators that just use a fixed number, we benchmark your metrics against a dataset of 5,000+ recent SaaS acquisitions.</p>
            
            <h3>The Core Inputs</h3>
            <ul>
                <li><strong>ARR (Annual Recurring Revenue):</strong> The foundation of your valuation. We focus on "pure" recurring revenue.</li>
                <li><strong>Growth Rate:</strong> The #1 driver of high multiples. Companies growing >50% YoY command a significant premium.</li>
                <li><strong>Churn Rate:</strong> The "leaky bucket" factor. High churn (>10% annual) can cut your multiple in half.</li>
            </ul>

            <h3>Why Accuracy Matters</h3>
            <p>A realistic valuation helps you set expectations with investors or potential buyers. By understanding the "why" behind the number, you can focus on the specific levers (like improving retention) that will yield the highest ROI for your exit value.</p>
        `
    },
    {
        id: 'saas-growth-calculator',
        title: 'SaaS Growth Calculator Guide',
        description: 'How to use growth modeling to project your path to $10M ARR and beyond. Master the variables that move the needle.',
        category: 'Guide',
        author: 'Michael Chen',
        date: 'Nov 5, 2025',
        readTime: '5 min read',
        content: `
            <h3>Projecting Your Future</h3>
            <p>Growth isn't just about adding new users. It's about cumulative momentum. This guide explains how to model your ARR growth using three main levers: New Logo Acquisition, Expansion Revenue, and Churn Mitigation.</p>
            
            <h3>Key Growth Variables</h3>
            <ul>
                <li><strong>Net New ARR:</strong> Revenue from brand new customers.</li>
                <li><strong>Expansion ARR:</strong> Upselling existing customers (the "Holy Grail" of SaaS growth).</li>
                <li><strong>Churn Impact:</strong> The negative drag that slows your climb.</li>
            </ul>

            <h3>The Path to $10M ARR</h3>
            <p>Crossing the $10M mark usually requires a shift from founder-led sales to a repeatable, scalable sales engine. Use our growth calculator to see where your bottleneck lies—is it lead generation, or is it retention?</p>
        `
    },
    {
        id: 'nrr-mastery',
        title: 'NRR Mastery: The Metric Builders Care About',
        description: 'Why Net Revenue Retention is the ultimate proof of product-market fit and how to drive it above 110%.',
        category: 'Metrics',
        author: 'Amanda White',
        date: 'Dec 1, 2025',
        readTime: '8 min read',
        content: `
            <h3>What is NRR?</h3>
            <p>Net Revenue Retention measures how much your revenue grows (or shrinks) from your *existing* customer base. If you have 110% NRR, you are growing 10% annually even if you never sign a single new customer.</p>
            
            <h3>Why Acquirers Prize High NRR</h3>
            <p>High NRR proves that your product is "sticky" and that you have natural expansion pathways. It significantly reduces the risk for a new owner, which directly results in a higher valuation multiple.</p>
            
            <h3>How to Boost NRR</h3>
            <ul>
                <li>Implement usage-based pricing.</li>
                <li>Launch tiered feature sets (standard vs pro).</li>
                <li>Proactive customer success outreach for accounts with high activity.</li>
            </ul>
        `
    },
    {
        id: 'exit-strategy',
        title: 'Exit Strategy: When to Sell vs. Hold',
        description: 'A framework for SaaS founders to decide between taking a life-changing exit today or building for a larger payday tomorrow.',
        category: 'Exit',
        author: 'Amanda White',
        date: 'Dec 15, 2025',
        readTime: '6 min read',
        content: `
            <h3>The Founders Dilemma</h3>
            <p>Deciding when to sell is often more emotional than financial. This article provides a quantitative framework to help you decide when the "multiple" is too good to pass up.</p>
            
            <h3>The Rule of 3x Multiple</h3>
            <p>If a buyer offers you 3x your current projected earnings over the next 5 years (discounted), it's often a "derisked" exit that allows you to start your next venture with capital in hand.</p>
            
            <h3>When to Hold</h3>
            <p>Hold if your growth is accelerating, your market is expanding, and you haven't hit the "ceiling" of your current acquisition channels. Selling during a period of high momentum can be profitable, but leaving 2x growth on the table might be a mistake if you have the energy to continue.</p>
        `
    }
];
