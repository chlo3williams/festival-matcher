const REQUEST_LIMIT = 3;
const STORAGE_KEY = 'llm_requests_left';

export const getRemainingRequests = () => {
  const remaining = localStorage.getItem(STORAGE_KEY);
  return remaining !== null ? parseInt(remaining) : REQUEST_LIMIT;
};

export const decrementRequests = () => {
  const remaining = getRemainingRequests();
  const newRemaining = Math.max(remaining - 1, 0);
  localStorage.setItem(STORAGE_KEY, newRemaining);
  return newRemaining;
};

export const resetRequests = () => {
  localStorage.setItem(STORAGE_KEY, REQUEST_LIMIT.toString());
  localStorage.setItem(`${STORAGE_KEY}_timestamp`, Date.now().toString());
};