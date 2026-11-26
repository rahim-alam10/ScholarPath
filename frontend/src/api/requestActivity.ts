let activeRequests = 0;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function getActiveRequestCount() {
  return activeRequests;
}

export function subscribeToRequestActivity(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function startTrackedRequest() {
  activeRequests += 1;
  notifyListeners();
  let finished = false;

  return () => {
    if (finished) return;
    finished = true;
    activeRequests = Math.max(0, activeRequests - 1);
    notifyListeners();
  };
}
