export function renderSummary(workspace, toast = '') {
  const decision = workspace.decision;
  const markdown = generateMarkdownSummary(workspace);
  return `
    <section class="card">
      <h2>Decision Summary</h2>
      ${toast ? `<p class="toast">${toast}</p>` : ''}
      <label>Chosen option
        <select name="chosenOption">
          <option value="">Select an option</option>
          <option value="A" ${decision.chosenOption === 'A' ? 'selected' : ''}>Option A</option>
          <option value="B" ${decision.chosenOption === 'B' ? 'selected' : ''}>Option B</option>
        </select>
      </label>
      <label>Rationale
        <textarea name="rationale">${escapeHtml(decision.rationale)}</textarea>
      </label>
      <label>Residual risks
        <textarea name="residualRisks">${escapeHtml(decision.residualRisks)}</textarea>
      </label>
      <label>Conditions for re-evaluation
        <textarea name="reevaluateConditions">${escapeHtml(decision.reevaluateConditions)}</textarea>
      </label>
      <label class="checkbox-inline"><input type="checkbox" name="acknowledged" ${decision.acknowledged ? 'checked' : ''}/> I acknowledge responsibility for this decision.</label>
      <div class="actions">
        <button id="save-decision" class="primary">Save Decision</button>
        <button id="copy-markdown" type="button">Copy summary as Markdown</button>
      </div>
      <article class="summary-card">
        <h3>Readable Summary</h3>
        <pre>${escapeHtml(markdown)}</pre>
      </article>
    </section>
  `;
}

export function generateMarkdownSummary(workspace) {
  const s = workspace;
  const allValues = [...s.values.selectedValues, ...s.values.customValues];
  const optionSummary = (option) => `
- **${option.title || 'Untitled option'}**
  - Description: ${option.description || '-'}
  - Supports: ${option.supportsValues.join(', ') || '-'}
  - Conflicts: ${option.conflictsValues.join(', ') || '-'}
  - Risk bearers: ${option.riskBearers || '-'}
  - Assumptions: ${option.assumptions || '-'}
`;

  return `# Ethical Decision Summary

- Workspace ID: ${s.id}
- Status: ${s.status}
- Updated: ${s.updatedAt || '-'}

## Context
- Project / Feature: ${s.context.name || '-'}
- Description: ${s.context.description || '-'}
- Decision to make: ${s.context.decision || '-'}
- Why now: ${s.context.whyNow || '-'}
- If no decision: ${s.context.ifNoDecision || '-'}

## Stakeholders
${s.stakeholders.map((st) => `- ${st.name || 'Unnamed'} (affected: ${st.affected ? 'yes' : 'no'}) | impacts: ${st.impactTypes.join(', ') || '-'} | notes: ${st.notes || '-'}`).join('\n') || '- None'}

## Values & Tensions
- Values: ${allValues.join(', ') || '-'}
- Tensions:
${s.tensions.map((t) => `  - ${t.leftValue || '?'} ↔ ${t.rightValue || '?'}${t.note ? ` (${t.note})` : ''}`).join('\n') || '  - None'}

## Deliberation
### Option A
${optionSummary(s.deliberation.optionA)}
### Option B
${optionSummary(s.deliberation.optionB)}

## Decision
- Chosen option: ${s.decision.chosenOption || '-'}
- Rationale: ${s.decision.rationale || '-'}
- Residual risks: ${s.decision.residualRisks || '-'}
- Re-evaluation conditions: ${s.decision.reevaluateConditions || '-'}
- Responsibility acknowledged: ${s.decision.acknowledged ? 'yes' : 'no'}
- Decided at: ${s.decision.decidedAt || '-'}
`;
}

function escapeHtml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
