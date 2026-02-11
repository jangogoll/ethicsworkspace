export function renderLanding(hasSaved) {
  return `
    <main class="landing">
      <section class="card">
        <h1>Ethical Decision Workspace</h1>
        <p class="lead">A workspace for making ethical decisions explicit. This tool supports human judgment. It does not make ethical decisions for you.</p>
        <div class="actions">
          <button id="new-workspace" class="primary">New Decision Workspace</button>
          <button id="load-workspace" ${hasSaved ? '' : 'disabled'}>Load last workspace</button>
        </div>
      </section>
    </main>
  `;
}
