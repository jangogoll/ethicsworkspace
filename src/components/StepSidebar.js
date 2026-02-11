const STEPS = ['Context', 'Stakeholders', 'Values', 'Deliberation', 'Decision Log'];

export function renderStepSidebar(activeStep) {
  return `
    <aside class="sidebar" aria-label="Decision steps">
      <h2>Steps</h2>
      <ol>
        ${STEPS.map((step, index) => {
          const realStep = index + 2;
          const cls = realStep === activeStep ? 'active' : realStep < activeStep ? 'done' : '';
          return `<li class="${cls}">${step}</li>`;
        }).join('')}
      </ol>
    </aside>
  `;
}
