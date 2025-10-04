import { useEffect, useState } from "react";

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
  className?: string;
}

export default function CircularProgress({
  value,
  maxValue = 7.83,
  size = 120,
  strokeWidth = 8,
  color,
  label,
  className = "",
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / maxValue) * circumference;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted opacity-20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground" data-testid={`text-${label}-score`}>
            {value.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">/ {maxValue}</span>
        </div>
      </div>
      <span className="text-sm font-semibold capitalize text-foreground" data-testid={`text-${label}-label`}>
        {label}
      </span>
    </div>
  );
}
