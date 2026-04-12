const SESSION_KEY = "analytics_session_id";

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function track(
  eventType: string,
  payload: Record<string, unknown>,
): void {
  try {
    fetch("/api/actions/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        session_id: getSessionId(),
        payload,
      }),
      keepalive: true,
    }).catch(() => {
      // Silently swallow — tracking must never affect UX
    });
  } catch {
    // Silently swallow
  }
}
