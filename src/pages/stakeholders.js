const IMPACT_TYPES = ['Risk', 'Exclusion', 'Dependency', 'Autonomy loss', 'Other'];

export function renderStakeholders(workspace) {
  return `
    <section class="card">
      <div class="section-head">
        <h2>Stakeholders</h2>
        <button id="add-stakeholder" type="button">+ Add stakeholder</button>
      </div>
      <div class="stakeholder-list">
        ${workspace.stakeholders
          .map(
            (s) => `
            <article class="stakeholder-card" data-id="${s.id}">
              <div class="grid-two">
                <label>Name / group
                  <input data-field="name" value="${escapeHtml(s.name)}" />
                </label>
                <label class="checkbox-inline"><input type="checkbox" data-field="affected" ${s.affected ? 'checked' : ''}/> Affected?</label>
              </div>
              <fieldset>
                <legend>Impact types</legend>
                <div class="tag-group">
                  ${IMPACT_TYPES.map((type) => `<label><input type="checkbox" data-field="impactTypes" value="${type}" ${s.impactTypes.includes(type) ? 'checked' : ''}/> ${type}</label>`).join('')}
                </div>
              </fieldset>
              <label>Notes
                <textarea data-field="notes">${escapeHtml(s.notes)}</textarea>
              </label>
              <button type="button" class="danger" data-action="remove">Remove</button>
            </article>
          `,
          )
          .join('')}
      </div>
    </section>
  `;
}

function escapeHtml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
