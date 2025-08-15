import { validateStep1, validateStep2, validateStep3, validateStep4, validateStep5, validateStep6, validateStep7 } from '../scripts/validation.js';
import { describe, test, expect, beforeEach } from '@jest/globals';

describe('validation steps', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('validateStep1', () => {
    document.body.innerHTML = `
      <input type="checkbox" id="method-multiplier" value="multiplier">
      <p id="method-error" class="hidden"></p>
      <button id="next-btn-1"></button>
    `;
    expect(validateStep1()).toBe(false);
    document.getElementById('method-multiplier').checked = true;
    expect(validateStep1()).toBe(true);
  });

  test('validateStep2', () => {
    const ids = ['arr','mrr','ltv','cac','gross-margin','net-profit','burn-rate','runway','custom-multiplier','discount-rate'];
    document.body.innerHTML = ids.map(id => `
        <input id="${id}" value="10" />
        <p id="${id}-error" class="hidden"></p>
    `).join('') + '<select id="business-type"><option value="5" selected>Type</option></select><p id="business-type-error" class="hidden"></p><p id="financial-error" class="hidden"></p><button id="next-btn-2"></button>';
    expect(validateStep2()).toBe(true);
    document.getElementById('arr').value = '';
    expect(validateStep2()).toBe(false);
  });

  test('validateStep3', () => {
    const ids = ['revenue-growth-yoy','revenue-growth-mom','customer-churn','revenue-churn'];
    document.body.innerHTML = ids.map(id => `
      <input id="${id}" value="10" />
      <p id="${id}-error" class="hidden"></p>
    `).join('') + '<p id="growth-churn-error" class="hidden"></p><button id="next-btn-3"></button>';
    expect(validateStep3()).toBe(true);
  });

  test('validateStep4', () => {
    document.body.innerHTML = `
      <input id="active-customers" value="10" />
      <input id="monthly-active-users" value="10" />
      <input id="retention-rate" value="50" />
      <input id="nps" value="10" />
      <select id="customer-segment"><option value="small-business" selected>Small</option></select>
      <select id="buyer-type"><option value="investors" selected>Investors</option></select>
      <p id="active-customers-error" class="hidden"></p>
      <p id="monthly-active-users-error" class="hidden"></p>
      <p id="retention-rate-error" class="hidden"></p>
      <p id="nps-error" class="hidden"></p>
      <p id="customer-segment-error" class="hidden"></p>
      <p id="buyer-type-error" class="hidden"></p>
      <p id="customer-market-error" class="hidden"></p>
      <button id="next-btn-4"></button>
    `;
    expect(validateStep4()).toBe(true);
  });

  test('validateStep5', () => {
    document.body.innerHTML = `
      <select id="product-market-fit"><option value="strong" selected>Strong</option></select>
      <select id="proprietary-tech"><option value="yes" selected>Yes</option></select>
      <select id="code-quality"><option value="good" selected>Good</option></select>
      <select id="scalable-infrastructure"><option value="yes" selected>Yes</option></select>
      <select id="feature-release-frequency"><option value="monthly" selected>Monthly</option></select>
      <select id="security-compliance"><option value="full" selected>Full</option></select>
      <p id="product-market-fit-error" class="hidden"></p>
      <p id="proprietary-tech-error" class="hidden"></p>
      <p id="code-quality-error" class="hidden"></p>
      <p id="scalable-infrastructure-error" class="hidden"></p>
      <p id="feature-release-frequency-error" class="hidden"></p>
      <p id="security-compliance-error" class="hidden"></p>
      <p id="product-tech-error" class="hidden"></p>
      <button id="next-btn-5"></button>
    `;
    expect(validateStep5()).toBe(true);
  });

  test('validateStep6', () => {
    document.body.innerHTML = `
      <input id="fte" value="10" />
      <input id="key-staff" value="5" />
      <input id="turnover-rate" value="5" />
      <input id="eng-sales-ratio" value="1" />
      <input id="support-tickets" value="5" />
      <input id="support-rating" value="5" />
      <input id="headcount-growth" value="5" />
      <p id="fte-error" class="hidden"></p>
      <p id="key-staff-error" class="hidden"></p>
      <p id="turnover-rate-error" class="hidden"></p>
      <p id="eng-sales-ratio-error" class="hidden"></p>
      <p id="support-tickets-error" class="hidden"></p>
      <p id="support-rating-error" class="hidden"></p>
      <p id="headcount-growth-error" class="hidden"></p>
      <p id="team-ops-error" class="hidden"></p>
      <button id="next-btn-6"></button>
    `;
    expect(validateStep6()).toBe(true);
  });

  test('validateStep7', () => {
    document.body.innerHTML = `
      <select id="legal-entity"><option value="llc" selected>LLC</option></select>
      <select id="ip-ownership"><option value="fully-owned" selected>Owned</option></select>
      <input id="contract-length" value="12" />
      <input id="contract-value" value="1000" />
      <select id="vendor-lockin"><option value="low" selected>Low</option></select>
      <select id="legal-issues"><option value="none" selected>None</option></select>
      <select id="data-privacy"><option value="full" selected>Full</option></select>
      <select id="cyber-insurance"><option value="yes" selected>Yes</option></select>
      <input id="debt-level" value="0" />
      <p id="legal-entity-error" class="hidden"></p>
      <p id="ip-ownership-error" class="hidden"></p>
      <p id="contract-length-error" class="hidden"></p>
      <p id="contract-value-error" class="hidden"></p>
      <p id="vendor-lockin-error" class="hidden"></p>
      <p id="legal-issues-error" class="hidden"></p>
      <p id="data-privacy-error" class="hidden"></p>
      <p id="cyber-insurance-error" class="hidden"></p>
      <p id="debt-level-error" class="hidden"></p>
      <p id="legal-risk-error" class="hidden"></p>
      <button id="next-btn-7"></button>
    `;
    expect(validateStep7()).toBe(true);
  });
});
