import { useEffect, useRef, useState } from "react";

/** Animated number counter for KPI / performance cards. Prototype-only, no data source. */
export function useCountUp(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    let timer: ReturnType<typeof setTimeout>;

    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) frame.current = requestAnimationFrame(step);
    };

    timer = setTimeout(() => {
      frame.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration, delay]);

  return value;
}
