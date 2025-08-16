export function initExplanations() {
  const boxes = document.querySelectorAll('.hidden-explanations .explanation-box');
  boxes.forEach((box) => {
    const targetId = box.dataset.for;
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    const details = document.createElement('details');
    details.className = 'mt-2 bg-gray-50 p-2 rounded';
    const summary = document.createElement('summary');
    summary.textContent = 'What does this mean?';
    summary.className = 'cursor-pointer text-sm text-teal-600';
    details.appendChild(summary);
    const content = document.createElement('div');
    // Clone children excluding the first heading
    Array.from(box.children).forEach((child, index) => {
      if (index === 0 && child.tagName && child.tagName.toLowerCase() === 'h4') return;
      content.appendChild(child.cloneNode(true));
    });
    details.appendChild(content);
    const container = target.closest('label') || target.parentElement;
    if (container.tagName.toLowerCase() === 'label') {
      container.insertAdjacentElement('afterend', details);
    } else {
      container.appendChild(details);
    }
  });
  document.querySelectorAll('.hidden-explanations').forEach((sec) => sec.remove());
}
