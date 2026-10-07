"use client";

import * as React from "react";

/**
 * Reveals items from a list one at a time on an interval, starting only when `active` is true.
 * Resets automatically whenever `active` flips back to false.
 */
export function useSequence<T>(items: T[], active: boolean, intervalMs = 1400) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    if (count >= items.length) return;
    const timeout = setTimeout(() => setCount((c) => c + 1), intervalMs);
    return () => clearTimeout(timeout);
  }, [active, count, items.length, intervalMs]);

  return {
    visibleItems: items.slice(0, count),
    isComplete: active && count >= items.length,
    count,
  };
}
