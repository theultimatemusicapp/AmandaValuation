(function() {
  const safePush = (event, params = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    } else if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({ event, ...params });
    } else {
      console.debug('Analytics event', event, params);
    }
  };

  const handleClick = (el) => {
    const event = el.getAttribute('data-analytics-event');
    const label = el.getAttribute('data-analytics-label');
    if (event) {
      safePush(event, { label });
    }
  };

  const handleSubmit = (form) => {
    const event = form.getAttribute('data-analytics-form');
    const label = form.getAttribute('data-analytics-label');
    if (event) {
      safePush(event, { label });
    }
  };

  const addListeners = () => {
    document.querySelectorAll('[data-analytics-event]').forEach(el => {
      el.addEventListener('click', () => handleClick(el));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(el);
        }
      });
    });

    document.querySelectorAll('form[data-analytics-form]').forEach(form => {
      form.addEventListener('submit', () => handleSubmit(form));
    });
  };

  document.addEventListener('DOMContentLoaded', addListeners);
})();
