export function renderContext(workspace) {
  const context = workspace.context;
  return `
    <section class="card">
      <h2>Context & Decision</h2>
      <label>Project / Feature name
        <input name="name" value="${escapeHtml(context.name)}" />
      </label>
      <label>Short description
        <textarea name="description">${escapeHtml(context.description)}</textarea>
      </label>
      <label>What exactly needs to be decided?
        <textarea name="decision">${escapeHtml(context.decision)}</textarea>
      </label>
      <label>Why now?
        <textarea name="whyNow">${escapeHtml(context.whyNow)}</textarea>
      </label>
      <label>What happens if no decision is made?
        <textarea name="ifNoDecision">${escapeHtml(context.ifNoDecision)}</textarea>
      </label>
    </section>
  `;
}

function escapeHtml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
