export function initNavigation(validation, calculateValuation) {
  const steps = document.querySelectorAll('.step');
  const progressFill = document.getElementById('progress-fill');
  const currentStepDisplay = document.getElementById('current-step');
  const totalStepsDisplay = document.getElementById('total-steps');
  const stepAnnounce = document.getElementById('step-announce');
  const stepDots = document.querySelectorAll('#stepper .step-dot');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const totalSteps = steps.length;
  if (totalStepsDisplay) totalStepsDisplay.textContent = totalSteps;
  let currentStep = 1;

  function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${progress}%`;
    progressFill.setAttribute('aria-valuenow', currentStep);
    progressFill.setAttribute('aria-valuemin', 1);
    progressFill.setAttribute('aria-valuemax', totalSteps);
    currentStepDisplay.textContent = currentStep;
  }

  function showStep(stepNumber) {
    steps.forEach(step => {
      step.classList.toggle('step-visible', step.dataset.step == stepNumber);
      step.classList.toggle('step-hidden', step.dataset.step != stepNumber);
    });
    currentStep = stepNumber;
    updateProgress();
    stepDots.forEach((dot, idx) => {
      if (idx + 1 === stepNumber) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
    if (stepAnnounce) stepAnnounce.textContent = `Step ${currentStep} of ${totalSteps}`;
    const stepElement = document.getElementById(`step-${currentStep}`);
    const focusElement = stepElement?.querySelector('h3') || stepElement;
    focusElement?.focus();
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      mobileMenu.hidden = open;
      (!open ? mobileMenu.querySelector('a') : menuToggle).focus();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });

        if (!mobileMenu.hidden) {
          mobileMenu.hidden = true;
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.focus();
        }
      }
    });
  });

  for (let i = 1; i < totalSteps; i++) {
    const nextBtn = document.getElementById(`next-btn-${i}`);
    const prevBtn = document.getElementById(`prev-btn-${i}`);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const validate = validation[`validateStep${i}`];
        if (!validate) {
          console.error(`Validation function for step ${i} not found`);
          return;
        }
        if (validate()) {
          showStep(i + 1);
          if (i === totalSteps - 1) {
            const loading = document.getElementById('loading-indicator');
            const results = document.getElementById('results-section');
            if (loading && results) {
              loading.classList.remove('hidden');
              results.classList.add('hidden');
              setTimeout(async () => {
                await calculateValuation();
                loading.classList.add('hidden');
                results.classList.remove('hidden');
              }, 3000);
            } else {
              calculateValuation();
            }
          }
        }
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => showStep(i - 1));
    }
  }

  showStep(1);
}
