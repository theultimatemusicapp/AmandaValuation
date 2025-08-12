export function initNavigation(validation, calculateValuation) {
  const steps = document.querySelectorAll('.step');
  const progressFill = document.getElementById('progress-fill');
  const currentStepDisplay = document.getElementById('current-step');
  let currentStep = 1;

  function updateProgress() {
    const progress = (currentStep / 7) * 100;
    progressFill.style.width = `${progress}%`;
    currentStepDisplay.textContent = currentStep;
  }

  function showStep(stepNumber) {
    steps.forEach(step => {
      step.classList.toggle('step-visible', step.dataset.step == stepNumber);
      step.classList.toggle('step-hidden', step.dataset.step != stepNumber);
    });
    currentStep = stepNumber;
    updateProgress();
  }

  document.getElementById('menu-toggle').addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    const icon = document.getElementById('menu-toggle').querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });

        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          const icon = document.getElementById('menu-toggle').querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  });

  for (let i = 1; i <= 7; i++) {
    const nextBtn = document.getElementById(`next-btn-${i}`);
    const prevBtn = document.getElementById(`prev-btn-${i}`);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const validate = validation[`validateStep${i}`];
        if (!validate || validate()) {
          showStep(i + 1);
          if (i === 7) calculateValuation();
        }
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => showStep(i - 1));
    }
  }

  showStep(1);
}
