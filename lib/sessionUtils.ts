const SESSION_TIMEOUT = 5 * 60 *10000; // 5 min

export const setupSessionTimeout = (callback: () => void) => {
  const timeoutId = setTimeout(() => {
    callback();
  }, SESSION_TIMEOUT);

  return timeoutId;
}; 