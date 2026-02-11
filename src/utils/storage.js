const WORKSPACE_KEY = 'ethical-workspace-current';
const DECISION_LOG_KEY = 'ethical-workspace-log';

export function loadWorkspace() {
  const raw = localStorage.getItem(WORKSPACE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveWorkspace(workspace) {
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
}

export function clearWorkspace() {
  localStorage.removeItem(WORKSPACE_KEY);
}

export function loadDecisionLog() {
  const raw = localStorage.getItem(DECISION_LOG_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function appendDecisionLog(entry) {
  const log = loadDecisionLog();
  log.unshift(entry);
  localStorage.setItem(DECISION_LOG_KEY, JSON.stringify(log));
}

export function hasSavedWorkspace() {
  return !!localStorage.getItem(WORKSPACE_KEY);
}
