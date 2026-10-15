"use client";

import React from "react";

interface CombatReadinessGaugeProps {
  percentage: number; // 0 to 100
  size?: number;
}

export const CombatReadinessGauge: React.FC<CombatReadinessGaugeProps> = ({
  percentage,
  size = 54,
}) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return "#10b981"; // Emerald
    if (percentage >= 50) return "#3b82f6"; // Blue
    if (percentage >= 25) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1f2937"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-bold text-white tracking-tight">
          {percentage}%
        </span>
      </div>
    </div>
  );
};
