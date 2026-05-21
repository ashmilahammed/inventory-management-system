import { useState, useEffect } from 'react';

/**
 * useDebounce
 * Delays updating the returned value until `delay` ms have passed
 * since the last change to `value`. Use this to avoid firing expensive
 * side-effects (e.g. API calls) on every keystroke.
 *
 * @param value  - The reactive value to debounce (typically a search string)
 * @param delay  - Debounce delay in milliseconds (default: 400 ms)
 * @returns        The debounced value — only updates after the user pauses typing
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the previous timer if the value changes before `delay` elapses
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
