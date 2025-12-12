const SAFE_FLOAT = value => {
  const num = parseFloat(value);
  return Number.isFinite(num) ? num : 0;
};

function calculateReadiness(metrics) {
  const weights = {
    revenueGrowth: 0.2,
    churn: 0.18,
    grossMargin: 0.12,
    differentiation: 0.15,
    acquisition: 0.12,
    runway: 0.08,
    team: 0.05,
    compliance: 0.1
  };

  const normalized = {
    revenueGrowth: Math.min(metrics.revenueGrowth / 20, 1),
    churn: Math.max(0, 1 - metrics.churn / 15),
    grossMargin: Math.min(metrics.grossMargin / 80, 1),
    differentiation: metrics.differentiation ? 1 : 0.5,
    acquisition: metrics.acquisitionChannels ? 1 : 0.6,
    runway: Math.min(metrics.runway / 18, 1),
    team: Math.min(metrics.teamSize / 10, 1),
    compliance: metrics.dataSensitivity ? 0.7 : 1
  };

  return Object.entries(weights).reduce(
    (score, [key, weight]) => score + normalized[key] * weight * 100,
    0
  );
}

function buildPrompt(data) {
  return `You are a startup advisor. Give blunt, concise feedback on this business model.\n` +
    `Company: ${data.companyName || 'N/A'}\nProduct: ${data.product}\nTarget customer: ${data.targetCustomer}\n` +
    `Pricing: ${data.pricingModel}\nDifferentiation: ${data.differentiation}\n` +
    `Acquisition: ${data.acquisitionChannels}\nMonthly revenue: ${data.monthlyRevenue}\n` +
    `Revenue growth MoM: ${data.revenueGrowthRate}% | Churn: ${data.churnRate}%\n` +
    `Gross margin: ${data.grossMargin}% | Team size: ${data.teamSize} | Runway: ${data.runway} months\n` +
    `Funding stage: ${data.fundingStage} | Data sensitivity: ${data.dataSensitivity}\n` +
    `List 3 biggest risks, 3 fast experiments to validate CAC/LTV, and 3 investor questions.`;
}

function summarizeInsights(data) {
  const strengths = [];
  const risks = [];
  const experiments = [];

  if (SAFE_FLOAT(data.revenueGrowthRate) >= 10) {
    strengths.push('Growth is above 10% MoM—highlight compounding traction.');
  } else {
    risks.push('Revenue growth is under 10% MoM; prove pull with a focused experiment.');
  }

  if (SAFE_FLOAT(data.churnRate) <= 5) {
    strengths.push('Churn is below 5%; retention story is investable.');
  } else {
    risks.push('Churn is above 5%; investigate activation and onboarding.');
  }

  if (SAFE_FLOAT(data.grossMargin) >= 70) {
    strengths.push('Healthy gross margins (70%+) enable scalable unit economics.');
  } else {
    risks.push('Gross margin under 70%; clarify COGS drivers or pricing power.');
  }

  if (data.differentiation.length > 60) {
    strengths.push('Clear differentiation narrative—surface it in every pitch.');
  } else {
    risks.push('Differentiation description is thin; sharpen the unique edge.');
  }

  if (data.acquisitionChannels.toLowerCase().includes('paid')) {
    risks.push('Paid acquisition noted—validate CAC payback quickly.');
  } else {
    strengths.push('Organic/partnership-heavy acquisition lowers CAC risk.');
  }

  if (SAFE_FLOAT(data.runway) < 9) {
    risks.push('Runway under 9 months; prioritize cash-efficient experiments.');
  }

  experiments.push(
    'Run a 2-week pricing A/B test on top three ICPs; track conversion and payback.',
    'Instrument onboarding to pinpoint drop-off; ship one friction fix per week.',
    'Pilot a founder-led outbound sprint (20 accounts/week) to validate messaging.'
  );

  return { strengths, risks, experiments };
}

function renderList(list, container, emptyText) {
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = `<li class="text-gray-500">${emptyText}</li>`;
    return;
  }
  list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    container.appendChild(li);
  });
}

function handleFeedback(event) {
  event.preventDefault();
  const form = event.target.closest('form');

  const data = {
    companyName: form.companyName.value.trim(),
    product: form.product.value.trim(),
    targetCustomer: form.targetCustomer.value.trim(),
    pricingModel: form.pricingModel.value.trim(),
    monthlyRevenue: form.monthlyRevenue.value.trim(),
    revenueGrowthRate: form.revenueGrowthRate.value.trim(),
    churnRate: form.churnRate.value.trim(),
    differentiation: form.differentiation.value.trim(),
    acquisitionChannels: form.acquisitionChannels.value.trim(),
    grossMargin: form.grossMargin.value.trim(),
    teamSize: form.teamSize.value.trim(),
    fundingStage: form.fundingStage.value,
    runway: form.runway.value.trim(),
    dataSensitivity: form.dataSensitivity.value
  };

  const readinessScore = Math.round(
    calculateReadiness({
      revenueGrowth: SAFE_FLOAT(data.revenueGrowthRate),
      churn: SAFE_FLOAT(data.churnRate),
      grossMargin: SAFE_FLOAT(data.grossMargin),
      differentiation: data.differentiation.length >= 40,
      acquisitionChannels: data.acquisitionChannels.length >= 20,
      runway: SAFE_FLOAT(data.runway),
      teamSize: SAFE_FLOAT(data.teamSize),
      dataSensitivity: data.dataSensitivity === 'high'
    })
  );

  const { strengths, risks, experiments } = summarizeInsights(data);

  document.getElementById('readiness-score').textContent = `${readinessScore}/100`;
  document.getElementById('readiness-meter').style.width = `${Math.min(100, readinessScore)}%`;

  renderList(strengths, document.getElementById('strength-list'), 'No strengths detected yet.');
  renderList(risks, document.getElementById('risk-list'), 'Add more detail to surface risks.');
  renderList(experiments, document.getElementById('experiment-list'), 'Add traction metrics to generate experiments.');

  const promptBox = document.getElementById('prompt-text');
  promptBox.value = buildPrompt(data);
  promptBox.focus();
  promptBox.select();
}

function initFeedbackForm() {
  const form = document.getElementById('feedback-form');
  form.addEventListener('submit', handleFeedback);
}

document.addEventListener('DOMContentLoaded', initFeedbackForm);
