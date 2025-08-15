function setFieldState(field, valid) {
  field.classList.toggle('border-green-500', valid);
  field.classList.toggle('border-red-500', !valid);
}

export function validateStep1() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const checked = document.querySelectorAll('input[type="checkbox"]:checked');
  const error = document.getElementById('method-error');
  const valid = checked.length >= 1 && checked.length <= 3;

  error.classList.toggle('hidden', valid);
  checkboxes.forEach(cb => setFieldState(cb, cb.checked));
  const next = document.getElementById('next-btn-1');
  if (next) next.disabled = !valid;

  return valid;
}

export function validateStep2() {
  const inputs = ['arr', 'mrr', 'ltv', 'cac', 'gross-margin', 'net-profit', 'burn-rate', 'runway', 'owner-salary', 'average-salary', 'employee-benefits', 'years-operating', 'custom-multiplier', 'discount-rate'];
  const optional = ['custom-multiplier', 'discount-rate'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (!input) {
      console.warn(`Input #${id} not found`);
      return;
    }
    const error = document.getElementById(`${id}-error`);
    const value = input.value.trim();
    const num = parseFloat(value);
    const isNumeric = value !== '' && !isNaN(num);
    let fieldValid;
    if (optional.includes(id)) {
      fieldValid = value === '' || (isNumeric && !(num < 0) && !(id === 'discount-rate' && num > 100));
    } else {
      fieldValid = isNumeric && !!value && !((num < 0 && id !== 'net-profit') || (id === 'gross-margin' && num > 100));
    }
    error.classList.toggle('hidden', fieldValid);
    setFieldState(input, fieldValid);
    if (!fieldValid) valid = false;
  });
  const businessType = document.getElementById('business-type');
  if (businessType) {
    const fieldValid = businessType.value !== '';
    const error = document.getElementById('business-type-error');
    if (error) error.classList.toggle('hidden', fieldValid);
    setFieldState(businessType, fieldValid);
    if (!fieldValid) valid = false;
  }
  document.getElementById('financial-error').classList.toggle('hidden', valid);
  const next = document.getElementById('next-btn-2');
  if (next) next.disabled = !valid;
  return valid;
}

export function validateStep3() {
  const inputs = ['revenue-growth-yoy', 'revenue-growth-mom', 'customer-churn', 'revenue-churn'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (!input) {
      console.warn(`Input #${id} not found`);
      return;
    }
    const error = document.getElementById(`${id}-error`);
    const value = input.value.trim();
    const num = parseFloat(value);
    const isNumeric = value !== '' && !isNaN(num);
    const fieldValid = isNumeric && num >= 0 && num <= 100;
    error.classList.toggle('hidden', fieldValid);
    setFieldState(input, fieldValid);
    if (!fieldValid) valid = false;
  });
  document.getElementById('growth-churn-error').classList.toggle('hidden', valid);
  const next = document.getElementById('next-btn-3');
  if (next) next.disabled = !valid;
  return valid;
}

export function validateStep4() {
  const inputs = ['active-customers', 'monthly-active-users', 'retention-rate', 'nps', 'customer-segment', 'buyer-type'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (!input) {
      console.warn(`Input #${id} not found`);
      return;
    }
    const error = document.getElementById(`${id}-error`);
    const value = input.value.trim();
    const numericFields = ['active-customers', 'monthly-active-users', 'retention-rate', 'nps'];
    let fieldValid;
    if (numericFields.includes(id)) {
      const num = parseFloat(value);
      const isNumeric = value !== '' && !isNaN(num);
      fieldValid = isNumeric && !(
        (['active-customers', 'monthly-active-users'].includes(id) && num < 0) ||
        (id === 'retention-rate' && (num < 0 || num > 100)) ||
        (id === 'nps' && (num < -100 || num > 100))
      );
    } else {
      fieldValid = !!value;
    }
    error.classList.toggle('hidden', fieldValid);
    setFieldState(input, fieldValid);
    if (!fieldValid) valid = false;
  });
  document.getElementById('customer-market-error').classList.toggle('hidden', valid);
  const next = document.getElementById('next-btn-4');
  if (next) next.disabled = !valid;
  return valid;
}

export function validateStep5() {
  const inputs = ['product-market-fit', 'proprietary-tech', 'code-quality', 'scalable-infrastructure', 'feature-release-frequency', 'security-compliance'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (!input) {
      console.warn(`Input #${id} not found`);
      return;
    }
    const error = document.getElementById(`${id}-error`);
    const fieldValid = !!input.value;
    error.classList.toggle('hidden', fieldValid);
    setFieldState(input, fieldValid);
    if (!fieldValid) valid = false;
  });
  document.getElementById('product-tech-error').classList.toggle('hidden', valid);
  const next = document.getElementById('next-btn-5');
  if (next) next.disabled = !valid;
  return valid;
}

export function validateStep6() {
  const inputs = ['fte', 'key-staff', 'turnover-rate', 'eng-sales-ratio', 'support-tickets', 'support-rating', 'headcount-growth'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (!input) {
      console.warn(`Input #${id} not found`);
      return;
    }
    const error = document.getElementById(`${id}-error`);
    const value = input.value.trim();
    const num = parseFloat(value);
    const isNumeric = value !== '' && !isNaN(num);
    const fieldValid = isNumeric && !(
      (['fte', 'key-staff', 'support-tickets'].includes(id) && num < 0) ||
      (id === 'turnover-rate' && (num < 0 || num > 100)) ||
      (id === 'eng-sales-ratio' && num < 0) ||
      (id === 'support-rating' && (num < 1 || num > 10)) ||
      (id === 'headcount-growth' && (num < -100 || num > 100))
    );
    error.classList.toggle('hidden', fieldValid);
    setFieldState(input, fieldValid);
    if (!fieldValid) valid = false;
  });
  document.getElementById('team-ops-error').classList.toggle('hidden', valid);
  const next = document.getElementById('next-btn-6');
  if (next) next.disabled = !valid;
  return valid;
}

export function validateStep7() {
  const inputs = ['legal-entity', 'ip-ownership', 'contract-length', 'contract-value', 'vendor-lockin', 'legal-issues', 'data-privacy', 'cyber-insurance', 'debt-level'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (!input) {
      console.warn(`Input #${id} not found`);
      return;
    }
    const error = document.getElementById(`${id}-error`);
    const value = input.value.trim();
    const numericFields = ['contract-length', 'contract-value', 'debt-level'];
    let fieldValid;
    if (numericFields.includes(id)) {
      const num = parseFloat(value);
      const isNumeric = value !== '' && !isNaN(num);
      fieldValid = isNumeric && !(num < 0);
    } else {
      fieldValid = !!value;
    }
    error.classList.toggle('hidden', fieldValid);
    setFieldState(input, fieldValid);
    if (!fieldValid) valid = false;
  });
  document.getElementById('legal-risk-error').classList.toggle('hidden', valid);
  const next = document.getElementById('next-btn-7');
  if (next) next.disabled = !valid;
  return valid;
}

export function setupValidationListeners() {
  for (let i = 1; i <= 7; i++) {
    const next = document.getElementById(`next-btn-${i}`);
    if (next) next.disabled = true;
  }

  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', validateStep1);
  });

  ['arr', 'mrr', 'ltv', 'cac', 'gross-margin', 'net-profit', 'burn-rate', 'runway', 'owner-salary', 'average-salary', 'employee-benefits', 'years-operating', 'custom-multiplier', 'discount-rate']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', validateStep2);
    });
  const businessTypeEl = document.getElementById('business-type');
  if (businessTypeEl) businessTypeEl.addEventListener('change', validateStep2);

  ['revenue-growth-yoy', 'revenue-growth-mom', 'customer-churn', 'revenue-churn']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', validateStep3);
    });

  ['active-customers', 'monthly-active-users', 'retention-rate', 'nps', 'customer-segment', 'buyer-type']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const evt = el.tagName.toLowerCase() === 'select' ? 'change' : 'input';
      el.addEventListener(evt, validateStep4);
    });

  ['product-market-fit', 'proprietary-tech', 'code-quality', 'scalable-infrastructure', 'feature-release-frequency', 'security-compliance']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const evt = el.tagName.toLowerCase() === 'select' ? 'change' : 'input';
      el.addEventListener(evt, validateStep5);
    });

  ['fte', 'key-staff', 'turnover-rate', 'eng-sales-ratio', 'support-tickets', 'support-rating', 'headcount-growth']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', validateStep6);
    });

  ['legal-entity', 'ip-ownership', 'contract-length', 'contract-value', 'vendor-lockin', 'legal-issues', 'data-privacy', 'cyber-insurance', 'debt-level']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const evt = el.tagName.toLowerCase() === 'select' ? 'change' : 'input';
      el.addEventListener(evt, validateStep7);
    });
}
