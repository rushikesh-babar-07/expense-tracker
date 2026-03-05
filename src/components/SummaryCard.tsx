import { useEffect, useRef, useState, ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}

function useAnimatedNumber(target: number, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);
  const raf = useRef<number>();

  useEffect(() => {
    const from = prev.current;
    const diff = target - from;
    if (Math.abs(diff) < 0.01) {
      setDisplay(target);
      prev.current = target;
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(from + diff * eased);
      if (t < 1) raf.current = requestAnimationFrame(step);
      else prev.current = target;
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return display;
}

const SummaryCard = ({ title, value, icon, onClick, clickable }: SummaryCardProps) => {
  const animated = useAnimatedNumber(value);

  return (
    <div
      onClick={onClick}
      className={`group rounded-xl border border-border bg-card p-5 transition-all duration-200 ${
        clickable
          ? "cursor-pointer hover:border-primary/50 hover:bg-accent hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          : "hover:border-border/80"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <span className="transition-transform duration-200 group-hover:scale-110">{icon}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums text-card-foreground">
        ₹{animated.toFixed(2)}
      </p>
      {clickable && (
        <p className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">Click to manage</p>
      )}
    </div>
  );
};

export default SummaryCard;
