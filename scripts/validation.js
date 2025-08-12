export function validateStep1() {
  const methods = document.querySelectorAll('input[type="checkbox"]:checked');
  const error = document.getElementById('method-error');
  if (methods.length < 1 || methods.length > 3) {
    error.classList.remove('hidden');
    return false;
  }
  error.classList.add('hidden');
  return true;
}

export function validateStep2() {
  const inputs = ['arr', 'mrr', 'ltv', 'cac', 'gross-margin', 'net-profit', 'burn-rate', 'runway'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!input.value || input.value < 0 || (id === 'gross-margin' && input.value > 100)) {
      error.classList.remove('hidden');
      valid = false;
    } else {
      error.classList.add('hidden');
    }
  });
  document.getElementById('financial-error').classList.toggle('hidden', valid);
  return valid;
}

export function validateStep3() {
  const inputs = ['revenue-growth-yoy', 'revenue-growth-mom', 'customer-churn', 'revenue-churn'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!input.value || input.value < 0 || input.value > 100) {
      error.classList.remove('hidden');
      valid = false;
    } else {
      error.classList.add('hidden');
    }
  });
  document.getElementById('growth-churn-error').classList.toggle('hidden', valid);
  return true;
}

export function validateStep4() {
  const inputs = ['active-customers', 'monthly-active-users', 'retention-rate', 'nps', 'customer-segment', 'buyer-type'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!input.value || (['active-customers', 'monthly-active-users'].includes(id) && input.value < 0) ||
        (id === 'retention-rate' && (input.value < 0 || input.value > 100)) ||
        (id === 'nps' && (input.value < -100 || input.value > 100))) {
      error.classList.remove('hidden');
      valid = false;
    } else {
      error.classList.add('hidden');
    }
  });
  document.getElementById('customer-market-error').classList.toggle('hidden', valid);
  return valid;
}

export function validateStep5() {
  const inputs = ['product-market-fit', 'proprietary-tech', 'code-quality', 'scalable-infrastructure', 'feature-release-frequency', 'security-compliance'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!input.value) {
      error.classList.remove('hidden');
      valid = false;
    } else {
      error.classList.add('hidden');
    }
  });
  document.getElementById('product-tech-error').classList.toggle('hidden', valid);
  return valid;
}

export function validateStep6() {
  const inputs = ['fte', 'key-staff', 'turnover-rate', 'eng-sales-ratio', 'support-tickets', 'support-rating', 'headcount-growth'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!input.value || (['fte', 'key-staff', 'support-tickets'].includes(id) && input.value < 0) ||
        (id === 'turnover-rate' && (input.value < 0 || input.value > 100)) ||
        (id === 'eng-sales-ratio' && input.value < 0) ||
        (id === 'support-rating' && (input.value < 1 || input.value > 10)) ||
        (id === 'headcount-growth' && (input.value < -100 || input.value > 100))) {
      error.classList.remove('hidden');
      valid = false;
    } else {
      error.classList.add('hidden');
    }
  });
  document.getElementById('team-ops-error').classList.toggle('hidden', valid);
  return valid;
}

export function validateStep7() {
  const inputs = ['legal-entity', 'ip-ownership', 'contract-length', 'contract-value', 'vendor-lockin', 'legal-issues', 'data-privacy', 'cyber-insurance', 'debt-level'];
  let valid = true;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!input.value || (['contract-length', 'contract-value', 'debt-level'].includes(id) && input.value < 0)) {
      error.classList.remove('hidden');
      valid = false;
    } else {
      error.classList.add('hidden');
    }
  });
  document.getElementById('legal-risk-error').classList.toggle('hidden', valid);
  return valid;
}
