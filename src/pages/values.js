const VALUE_OPTIONS = ['Fairness', 'Safety', 'Transparency', 'Autonomy', 'Efficiency', 'Privacy', 'Sustainability', 'Dignity', 'Accountability'];
const PRESETS = [
  { leftValue: 'Fairness', rightValue: 'Efficiency', note: '' },
  { leftValue: 'Transparency', rightValue: 'Performance', note: '' },
];

export function renderValues(workspace) {
  const values = workspace.values;
  return `
    <section class="card">
      <h2>Values & Tensions</h2>
      <fieldset>
        <legend>Select values</legend>
        <div class="tag-group">
          ${VALUE_OPTIONS.map((v) => `<label><input type="checkbox" data-field="selectedValue" value="${v}" ${values.selectedValues.includes(v) ? 'checked' : ''}/> ${v}</label>`).join('')}
        </div>
      </fieldset>
      <label>Custom value
        <div class="inline-row">
          <input id="custom-value-input" placeholder="Type custom value" />
          <button id="add-custom-value" type="button">Add</button>
        </div>
      </label>
      <div class="chips">${values.customValues.map((v, i) => `<button type="button" class="chip" data-remove-custom="${i}">${v} ×</button>`).join('')}</div>
      <div class="section-head"><h3>Tensions</h3><button id="add-tension" type="button">+ Add tension pair</button></div>
      <p>Suggestions: ${PRESETS.map((p, i) => `<button type="button" class="link-btn" data-add-preset="${i}">${p.leftValue} ↔ ${p.rightValue}</button>`).join(' · ')}</p>
      <div class="tension-list">
      ${workspace.tensions.map((t) => `
        <article class="tension-row" data-id="${t.id}">
          <input data-field="leftValue" value="${escapeHtml(t.leftValue)}" placeholder="Value A" />
          <span>↔</span>
          <input data-field="rightValue" value="${escapeHtml(t.rightValue)}" placeholder="Value B" />
          <input data-field="note" value="${escapeHtml(t.note)}" placeholder="Optional note" />
          <button type="button" data-action="remove">Remove</button>
        </article>
      `).join('')}
      </div>
    </section>
  `;
}

export function getValueOptions() {
  return VALUE_OPTIONS;
}

export function getTensionPresets() {
  return PRESETS;
}

function escapeHtml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
