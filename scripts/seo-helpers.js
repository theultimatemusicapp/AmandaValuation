(function() {
  const baseUrl = 'https://saasvaluation.app/';
  const brand = 'SaaS Valuation App';
  const articleDefaults = [
    {
      key: 'ai-saas-valuation-bubble.html',
      author: 'Amanda White',
      datePublished: '2025-08-26'
    },
    {
      key: 'capital-efficiency-2026-saas-valuations.html',
      author: 'Amanda White',
      datePublished: '2025-10-21'
    },
    {
      key: 'why-a-new-generation-is-quietly-reshaping-the-saas-landscape.html',
      author: 'Amanda White',
      datePublished: '2025-10-27'
    },
    {
      key: 'how-to-value-saas.html',
      author: 'John Edwards',
      datePublished: '2025-03-13'
    },
    {
      key: 'valuing-ai-driven-trends.html',
      author: 'Ben Howard',
      datePublished: '2025-04-15'
    },
    {
      key: 'selling-your-small-business.html',
      author: 'Josie Brosovic',
      datePublished: '2025-05-01'
    },
    {
      key: 'strategies-for-customer-retention.html',
      author: 'Sarah Lin',
      datePublished: '2025-06-10'
    },
    {
      key: 'grow-tactics-for-2025.html',
      author: 'Michael Chen',
      datePublished: '2025-07-15'
    },
    {
      key: 'boost-saas-revenue.html',
      author: 'Emily Rivera',
      datePublished: '2025-08-20'
    },
    {
      key: 'How-to-value-my-saas-company.html',
      author: 'Amanda White',
      datePublished: '2025-08-19'
    },
    {
      key: 'How-to-value-your-saas-company.html',
      author: 'Jane Carter',
      datePublished: '2025-07-30'
    },
    {
      key: 'the-rule-of-40.html',
      author: 'Michael Chen',
      datePublished: '2025-08-19'
    },
    {
      key: 'Saas-Valuation-Multiples.html',
      author: 'Amanda White',
      datePublished: '2025-09-22'
    },
    {
      key: 'how-much-is-my-saas-worth-10k-mrr.html',
      author: 'Amanda White',
      datePublished: '2025-10-01',
      dateModified: '2026-01-15'
    },
    {
      key: 'saas-valuation-for-bootstrapped-founders.html',
      author: 'Ben Howard',
      datePublished: '2025-10-01'
    },
    {
      key: 'what-multiple-do-saas-businesses-sell-for-2025.html',
      author: 'Jane Carter',
      datePublished: '2025-10-01'
    },
    {
      key: 'saas-valuation-with-no-profit.html',
      author: 'Sarah Lin',
      datePublished: '2025-10-01'
    },
    {
      key: 'saas-valuation-one-customer-vs-many.html',
      author: 'Michael Chen',
      datePublished: '2025-10-01'
    },
    {
      key: 'micro-saas-valuation-under-1m-arr.html',
      author: 'John Edwards',
      datePublished: '2025-10-01'
    },
    {
      key: 'saas-exit-valuation-calculator-explained.html',
      author: 'Ben Howard',
      datePublished: '2025-10-01'
    },
    {
      key: 'how-buyers-value-small-saas-businesses.html',
      author: 'Jane Carter',
      datePublished: '2025-10-01'
    }
  ];

  const articleMeta = articleDefaults.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});

  const pageConfig = {
    'blogs.html': { breadcrumbLabel: 'Blog' },
    'resources.html': { breadcrumbLabel: 'Resources' }
  };

  const defaultFaq = [
    {
      question: 'How do buyers evaluate SaaS valuation ranges?',
      answer: 'Most start with ARR or revenue multiples, then adjust for growth, net retention, gross margin, burn efficiency, and customer concentration risk.'
    },
    {
      question: 'What should I improve before I sell my SaaS business?',
      answer: 'Tighten churn, expand ARPU, document your data room, and reduce reliance on a single customer so buyers can underwrite durable revenue.'
    }
  ];

  const sanitizeTitle = (title) => {
    if (!title) return '';
    const cleaned = title.replace(new RegExp(`\\s*\\|\\s*${brand}$`), '').trim();
    return cleaned || title;
  };

  const ensureCanonical = (pageKey) => {
    const existing = document.querySelector('link[rel="canonical"]');
    const canonicalHref = existing?.getAttribute('href') || new URL(pageKey === 'index.html' ? 'index.html' : pageKey, baseUrl).href;
    if (!existing) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalHref);
      document.head.appendChild(link);
    }
    return canonicalHref;
  };

  const injectJsonLd = (data) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  };

  const buildBreadcrumbs = (pageKey, canonicalHref) => {
    const title = sanitizeTitle(document.title);
    const customConfig = pageConfig[pageKey] || {};
    const crumbs = [
      { label: 'Home', url: baseUrl }
    ];

    if (pageKey !== 'index.html') {
      if (articleMeta[pageKey]) {
        crumbs.push({ label: 'Resources', url: `${baseUrl}resources.html` });
      } else if (customConfig.parent) {
        crumbs.push({ label: customConfig.parent.label, url: customConfig.parent.url });
      }

      const currentLabel = customConfig.breadcrumbLabel || title || pageKey.replace('.html', '');
      crumbs.push({ label: currentLabel, url: canonicalHref });
    }

    const breadcrumbNav = document.createElement('nav');
    breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');
    breadcrumbNav.className = 'bg-gray-50 border-b border-gray-200';

    const listItems = crumbs.map((crumb, index) => {
      const isLast = index === crumbs.length - 1;
      const content = isLast
        ? `<span class="font-semibold text-gray-800" aria-current="page">${crumb.label}</span>`
        : `<a class="hover:text-teal-600 font-medium" href="${crumb.url}">${crumb.label}</a>`;

      return `<li class="flex items-center gap-2">${index > 0 ? '<span aria-hidden="true" class="text-gray-400">/</span>' : ''}${content}</li>`;
    }).join('');

    breadcrumbNav.innerHTML = `
      <ol class="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-2 text-sm text-gray-600">
        ${listItems}
      </ol>
    `;

    const header = document.querySelector('header');
    if (header && header.parentNode) {
      header.insertAdjacentElement('afterend', breadcrumbNav);
    } else if (document.body.firstChild) {
      document.body.insertBefore(breadcrumbNav, document.body.firstChild);
    } else {
      document.body.appendChild(breadcrumbNav);
    }

    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: crumb.url
      }))
    });
  };

  const buildArticleSchema = (pageKey, canonicalHref) => {
    const article = articleMeta[pageKey];
    if (!article) return;

    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const headline = sanitizeTitle(document.title) || article.headline;
    const description = article.description || metaDescription;

    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      mainEntityOfPage: canonicalHref,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: brand,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}favicon-96x96.png`
        }
      },
      image: `${baseUrl}social-preview.png`,
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished
    });

    const faqItems = Array.isArray(article.faq) ? article.faq : defaultFaq;
    if (!faqItems.length) return;

    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const pageKey = (window.location.pathname.split('/').pop() || 'index.html') || 'index.html';
    const canonicalHref = ensureCanonical(pageKey);
    buildBreadcrumbs(pageKey, canonicalHref);
    buildArticleSchema(pageKey, canonicalHref);
  });
})();
