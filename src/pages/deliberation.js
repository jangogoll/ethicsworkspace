export function renderDeliberation(workspace) {
  const values = [...workspace.values.selectedValues, ...workspace.values.customValues];
  return `
    <section class="card">
      <h2>Deliberation</h2>
      <div class="option-grid">
        ${renderOption('optionA', 'Option A', workspace.deliberation.optionA, values)}
        ${renderOption('optionB', 'Option B', workspace.deliberation.optionB, values)}
      </div>
      <aside class="reflection">
        <strong>Reflection prompt</strong>
        <p>Which value are you implicitly prioritizing here? What are the tradeoffs?</p>
      </aside>
    </section>
  `;
}

function renderOption(key, label, option, values) {
  return `
    <article class="option-card" data-option="${key}">
      <h3>${label}</h3>
      <label>Title
        <input data-field="title" value="${escapeHtml(option.title)}" />
      </label>
      <label>Description
        <textarea data-field="description">${escapeHtml(option.description)}</textarea>
      </label>
      <fieldset>
        <legend>Supports values</legend>
        <div class="tag-group">${values.map((value) => `<label><input type="checkbox" data-field="supportsValues" value="${value}" ${option.supportsValues.includes(value) ? 'checked' : ''}/> ${value}</label>`).join('')}</div>
      </fieldset>
      <fieldset>
        <legend>Conflicts with values</legend>
        <div class="tag-group">${values.map((value) => `<label><input type="checkbox" data-field="conflictsValues" value="${value}" ${option.conflictsValues.includes(value) ? 'checked' : ''}/> ${value}</label>`).join('')}</div>
      </fieldset>
      <label>Who bears the risk?
        <input data-field="riskBearers" value="${escapeHtml(option.riskBearers)}" />
      </label>
      <label>Key uncertain assumptions
        <textarea data-field="assumptions">${escapeHtml(option.assumptions)}</textarea>
      </label>
    </article>
  `;
}

function escapeHtml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
