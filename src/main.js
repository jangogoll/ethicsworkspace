import { renderStepSidebar } from './components/StepSidebar.js';
import { renderLanding } from './pages/landing.js';
import { renderContext } from './pages/context.js';
import { renderStakeholders } from './pages/stakeholders.js';
import { getTensionPresets, renderValues } from './pages/values.js';
import { renderDeliberation } from './pages/deliberation.js';
import { generateMarkdownSummary, renderSummary } from './pages/summary.js';
import { appendDecisionLog, hasSavedWorkspace, loadWorkspace, saveWorkspace } from './utils/storage.js';

const app = document.getElementById('app');

const blankWorkspace = () => ({
  id: crypto.randomUUID(),
  title: 'Ethical Decision Workspace',
  status: 'Draft',
  updatedAt: new Date().toISOString(),
  context: { name: '', description: '', decision: '', whyNow: '', ifNoDecision: '' },
  stakeholders: [],
  values: { selectedValues: [], customValues: [] },
  tensions: [],
  deliberation: {
    optionA: { title: '', description: '', supportsValues: [], conflictsValues: [], riskBearers: '', assumptions: '' },
    optionB: { title: '', description: '', supportsValues: [], conflictsValues: [], riskBearers: '', assumptions: '' },
  },
  decision: { chosenOption: '', rationale: '', residualRisks: '', reevaluateConditions: '', acknowledged: false, decidedAt: '' },
});

const state = {
  step: 1,
  workspace: blankWorkspace(),
  toast: '',
};

function setStatusForStep() {
  if (state.step >= 5 && state.workspace.status !== 'Decided') {
    state.workspace.status = 'In deliberation';
  } else if (state.step < 5 && state.workspace.status !== 'Decided') {
    state.workspace.status = 'Draft';
  }
}

function touchAndSave() {
  state.workspace.updatedAt = new Date().toISOString();
  saveWorkspace(state.workspace);
}

function layout(content) {
  if (state.step === 1) return content;
  const progress = `Step ${state.step - 1} / 5`;
  return `
    <div class="workspace-layout">
      ${renderStepSidebar(state.step)}
      <div class="main-pane">
        <header class="topbar">
          <div>
            <h1>${state.workspace.title}</h1>
            <p class="muted">Structured support for human ethical judgment.</p>
          </div>
          <div class="top-meta">
            <span class="badge">${state.workspace.status}</span>
            <span class="progress">${progress}</span>
          </div>
        </header>
        ${content}
        <footer class="nav-row">
          <button id="back-btn" ${state.step === 2 ? '' : ''}>Back</button>
          <button id="continue-btn" class="primary">${state.step === 5 ? 'Make Decision' : state.step === 6 ? 'Finish' : 'Continue'}</button>
        </footer>
      </div>
    </div>
  `;
}

function render() {
  setStatusForStep();
  let content = '';
  if (state.step === 1) content = renderLanding(hasSavedWorkspace());
  if (state.step === 2) content = renderContext(state.workspace);
  if (state.step === 3) content = renderStakeholders(state.workspace);
  if (state.step === 4) content = renderValues(state.workspace);
  if (state.step === 5) content = renderDeliberation(state.workspace);
  if (state.step === 6) content = renderSummary(state.workspace, state.toast);

  app.innerHTML = layout(content);
  bindEvents();
}

function nextStep() {
  state.step = Math.min(6, state.step + 1);
  touchAndSave();
  render();
}

function prevStep() {
  if (state.step === 2) state.step = 1;
  else state.step = Math.max(1, state.step - 1);
  render();
}

function updateObject(obj, field, value) {
  obj[field] = value;
  touchAndSave();
}

function bindEvents() {
  if (state.step === 1) {
    app.querySelector('#new-workspace').addEventListener('click', () => {
      state.workspace = blankWorkspace();
      state.step = 2;
      touchAndSave();
      render();
    });
    const loadBtn = app.querySelector('#load-workspace');
    if (loadBtn) {
      loadBtn.addEventListener('click', () => {
        const loaded = loadWorkspace();
        if (loaded) {
          state.workspace = loaded;
          state.step = 2;
          render();
        }
      });
    }
    return;
  }

  app.querySelector('#back-btn').addEventListener('click', prevStep);
  const continueBtn = app.querySelector('#continue-btn');
  if (state.step < 6) {
    continueBtn.addEventListener('click', nextStep);
  } else {
    continueBtn.style.display = 'none';
  }

  if (state.step === 2) {
    app.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', (e) => updateObject(state.workspace.context, e.target.name, e.target.value));
    });
  }

  if (state.step === 3) {
    app.querySelector('#add-stakeholder').addEventListener('click', () => {
      state.workspace.stakeholders.push({ id: crypto.randomUUID(), name: '', affected: false, impactTypes: [], notes: '' });
      touchAndSave();
      render();
    });

    app.querySelectorAll('.stakeholder-card').forEach((card) => {
      const id = card.dataset.id;
      const stakeholder = state.workspace.stakeholders.find((s) => s.id === id);
      card.querySelectorAll('[data-field]').forEach((field) => {
        field.addEventListener('input', () => {
          const prop = field.dataset.field;
          if (prop === 'affected') stakeholder.affected = field.checked;
          else if (prop === 'impactTypes') {
            if (field.checked) stakeholder.impactTypes.push(field.value);
            else stakeholder.impactTypes = stakeholder.impactTypes.filter((v) => v !== field.value);
          } else stakeholder[prop] = field.value;
          touchAndSave();
        });
        field.addEventListener('change', () => field.dispatchEvent(new Event('input')));
      });
      card.querySelector('[data-action="remove"]').addEventListener('click', () => {
        state.workspace.stakeholders = state.workspace.stakeholders.filter((s) => s.id !== id);
        touchAndSave();
        render();
      });
    });
  }

  if (state.step === 4) {
    app.querySelectorAll('input[data-field="selectedValue"]').forEach((box) => {
      box.addEventListener('change', () => {
        if (box.checked) state.workspace.values.selectedValues.push(box.value);
        else state.workspace.values.selectedValues = state.workspace.values.selectedValues.filter((v) => v !== box.value);
        touchAndSave();
      });
    });

    app.querySelector('#add-custom-value').addEventListener('click', () => {
      const input = app.querySelector('#custom-value-input');
      const value = input.value.trim();
      if (!value) return;
      state.workspace.values.customValues.push(value);
      input.value = '';
      touchAndSave();
      render();
    });

    app.querySelectorAll('[data-remove-custom]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.removeCustom);
        state.workspace.values.customValues.splice(idx, 1);
        touchAndSave();
        render();
      });
    });

    app.querySelector('#add-tension').addEventListener('click', () => {
      state.workspace.tensions.push({ id: crypto.randomUUID(), leftValue: '', rightValue: '', note: '' });
      touchAndSave();
      render();
    });

    app.querySelectorAll('[data-add-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = getTensionPresets()[Number(btn.dataset.addPreset)];
        state.workspace.tensions.push({ id: crypto.randomUUID(), ...preset });
        touchAndSave();
        render();
      });
    });

    app.querySelectorAll('.tension-row').forEach((row) => {
      const item = state.workspace.tensions.find((t) => t.id === row.dataset.id);
      row.querySelectorAll('[data-field]').forEach((input) => {
        input.addEventListener('input', () => {
          item[input.dataset.field] = input.value;
          touchAndSave();
        });
      });
      row.querySelector('[data-action="remove"]').addEventListener('click', () => {
        state.workspace.tensions = state.workspace.tensions.filter((t) => t.id !== row.dataset.id);
        touchAndSave();
        render();
      });
    });
  }

  if (state.step === 5) {
    app.querySelectorAll('.option-card').forEach((card) => {
      const option = state.workspace.deliberation[card.dataset.option];
      card.querySelectorAll('[data-field]').forEach((field) => {
        field.addEventListener('input', () => {
          const prop = field.dataset.field;
          if (prop === 'supportsValues' || prop === 'conflictsValues') {
            if (field.checked) option[prop].push(field.value);
            else option[prop] = option[prop].filter((v) => v !== field.value);
          } else option[prop] = field.value;
          touchAndSave();
        });
        field.addEventListener('change', () => field.dispatchEvent(new Event('input')));
      });
    });
  }

  if (state.step === 6) {
    app.querySelectorAll('select[name], textarea[name], input[name]').forEach((field) => {
      field.addEventListener('input', () => {
        const name = field.name;
        state.workspace.decision[name] = name === 'acknowledged' ? field.checked : field.value;
        touchAndSave();
      });
      field.addEventListener('change', () => field.dispatchEvent(new Event('input')));
    });

    app.querySelector('#save-decision').addEventListener('click', () => {
      if (!state.workspace.decision.acknowledged) {
        state.toast = 'Please acknowledge responsibility before saving.';
        render();
        return;
      }
      state.workspace.status = 'Decided';
      state.workspace.decision.decidedAt = new Date().toISOString();
      touchAndSave();
      appendDecisionLog({
        savedAt: state.workspace.decision.decidedAt,
        workspaceId: state.workspace.id,
        summary: generateMarkdownSummary(state.workspace),
      });
      state.toast = 'Decision documented. Ethical responsibility remains human.';
      render();
    });

    app.querySelector('#copy-markdown').addEventListener('click', async () => {
      await navigator.clipboard.writeText(generateMarkdownSummary(state.workspace));
      state.toast = 'Summary copied to clipboard.';
      render();
    });
  }
}

render();
