(function () {
  const navLinks = [
    { href: 'index.html#valuation', label: 'Valuation Tool', ariaLabel: 'Go to the valuation tool' },
    { href: 'index.html#data-room', label: 'AI Data Room', ariaLabel: 'Learn about the AI data room' },
    { href: 'index.html#pricing', label: 'Pricing', ariaLabel: 'See pricing options' },
    { href: 'saas-growth-calculator.html', label: 'Growth Calculator', ariaLabel: 'Open the SaaS growth calculator' },
    { href: 'resources.html', label: 'Resources', ariaLabel: 'Browse resources and guides' },
    { href: 'blog.html', label: 'Blog', ariaLabel: 'Read our latest posts' },
    { href: 'Support.html#contact-support', label: 'Support', ariaLabel: 'Contact or get support' }
  ];

  const renderNavLinks = (extraClasses = '') =>
    navLinks
      .map(
        link =>
          `<a href="${link.href}" class="${extraClasses}" aria-label="${link.ariaLabel}">${link.label}</a>`
      )
      .join('');

  const headerTemplate = `
    <header class="site-header bg-gray-900 text-white shadow-lg sticky top-0 z-50" role="banner">
      <div class="container mx-auto px-6 flex justify-between items-center py-4">
        <div class="flex items-center space-x-3">
          <a href="/" class="flex items-center space-x-3" aria-label="SaaS Valuation App home">
            <img src="favicon-96x96.png" alt="SaaS Valuation App logo" class="h-10 w-10 rounded" loading="lazy">
            <span class="text-xl font-bold">SaaS Valuation App</span>
          </a>
        </div>
        <nav class="hidden md:flex space-x-6 items-center" aria-label="Primary navigation">
          ${renderNavLinks('hover:text-teal-300 nav-link')}
          <a href="payment.html" class="ml-2 bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg shadow hover:bg-teal-100" aria-label="Upgrade to the pro valuation">Go Pro</a>
        </nav>
        <button id="menu-toggle" type="button" class="md:hidden focus:outline-none" aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle navigation menu">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div id="mobile-menu" class="md:hidden hidden border-t border-gray-800 bg-gray-900" role="dialog" aria-label="Mobile navigation">
        <nav class="flex flex-col space-y-3 px-6 py-4" aria-label="Primary navigation mobile">
          ${renderNavLinks('hover:text-teal-300 py-2 border-b border-gray-800 last:border-b-0')}
          <a href="payment.html" class="mt-2 inline-flex items-center justify-center px-4 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-teal-100" aria-label="Upgrade to the pro valuation">Go Pro</a>
        </nav>
      </div>
    </header>
  `;

  const footerTemplate = `
    <footer class="site-footer bg-gray-900 text-white py-12" role="contentinfo">
      <div class="container mx-auto px-6 space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <img src="favicon-96x96.png" alt="SaaS Valuation App logo" class="h-10 w-10 rounded" loading="lazy">
              <div>
                <p class="text-lg font-bold">SaaS Valuation App</p>
                <p class="text-gray-300 text-sm">Investor-ready valuations and growth tools for founders.</p>
              </div>
            </div>
            <div class="text-sm text-gray-400 space-y-2" aria-label="Business information">
              <p class="font-semibold text-gray-200">Registered business:</p>
              <p>Amanda Valuation LLC — Delaware, USA</p>
              <p>Registered agent mailing: 651 N Broad St, Suite 206, Middletown, DE 19709</p>
              <p>Mailing address: 2261 Market Street #4178, San Francisco, CA 94114</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6" aria-label="Site links">
            <div>
              <h3 class="text-lg font-semibold mb-3">Product</h3>
              <ul class="space-y-2 text-gray-300">
                <li><a href="index.html#valuation" class="hover:text-teal-300">Valuation Tool</a></li>
                <li><a href="payment.html" class="hover:text-teal-300">Pro Valuation</a></li>
                <li><a href="saas-growth-calculator.html" class="hover:text-teal-300">Growth Calculator</a></li>
                <li><a href="index.html#pricing" class="hover:text-teal-300">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-3">Resources</h3>
              <ul class="space-y-2 text-gray-300">
                <li><a href="resources.html" class="hover:text-teal-300">Resources Hub</a></li>
                <li><a href="blog.html" class="hover:text-teal-300">Blog</a></li>
                <li><a href="valuation-guide.html" class="hover:text-teal-300">Valuation Guide</a></li>
                <li><a href="Support.html#contact-support" class="hover:text-teal-300">Contact &amp; Support</a></li>
              </ul>
            </div>
          </div>
          <div class="space-y-4" aria-label="Contact information">
            <h3 class="text-lg font-semibold">Contact &amp; Support</h3>
            <p class="text-gray-300">Email: <a class="text-teal-300 hover:text-teal-200" href="mailto:support@saasvaluation.app">support@saasvaluation.app</a></p>
            <p class="text-gray-300">Support hours: Monday–Friday, 9:00 AM–5:00 PM PT</p>
            <p class="text-gray-300">For filings or legal notices, use the registered address above.</p>
            <div class="flex flex-col sm:flex-row gap-3">
              <a href="Support.html" class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold hover:bg-teal-100" aria-label="Go to the support page">Support Center</a>
              <a href="Support.html#contact-support" class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600" aria-label="Jump to the contact form">Contact Us</a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p class="text-gray-400 text-sm">© 2025 SaaS Valuation App. All rights reserved.</p>
          <div class="flex gap-4 text-sm text-gray-300">
            <a class="hover:text-teal-300" href="privacy-policy.html">Privacy Policy</a>
            <a class="hover:text-teal-300" href="terms-and-conditions.html">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  function ensureGlobalStyles() {
    const hasGlobalStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some(link => (link.getAttribute('href') || '').includes('styles/global.css'));
    if (!hasGlobalStyles) {
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = 'styles/global.css';
      document.head.appendChild(linkEl);
    }
  }

  function swapLayout() {
    ensureGlobalStyles();
    document.body.dataset.sharedLayout = 'true';

    if (!document.querySelector('.skip-link')) {
      document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#main-content">Skip to main content</a>');
    }

    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }

    const existingHeader = document.querySelector('header');
    if (existingHeader) existingHeader.outerHTML = headerTemplate;
    else document.body.insertAdjacentHTML('afterbegin', headerTemplate);

    const existingFooter = document.querySelector('footer');
    if (existingFooter) existingFooter.outerHTML = footerTemplate;
    else document.body.insertAdjacentHTML('beforeend', footerTemplate);

    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
      mobileMenu.hidden = true;
      mobileMenu.classList.add('hidden');
      menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        const nextOpen = !isOpen;
        menuToggle.setAttribute('aria-expanded', String(nextOpen));
        mobileMenu.hidden = !nextOpen;
        mobileMenu.classList.toggle('hidden', !nextOpen);
        if (nextOpen) {
          mobileMenu.querySelector('a')?.focus();
        } else {
          menuToggle.focus();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', swapLayout);
  } else {
    swapLayout();
  }
})();
