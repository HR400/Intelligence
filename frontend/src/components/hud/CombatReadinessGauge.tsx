"use client";

import React from "react";

interface CombatReadinessGaugeProps {
  percentage: number; // 0 to 100
  size?: number;
}

export const CombatReadinessGauge: React.FC<CombatReadinessGaugeProps> = ({
  percentage,
  size = 46,
}) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return "#d4af37"; // Brand Gold — high readiness
    if (percentage >= 50) return "#2563eb"; // Mana Blue — moderate
    if (percentage >= 25) return "#c5a880"; // Gilded Accent — low
    return "#991b1b";                       // Crimson — critical
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2d3545"
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
          strokeLinecap="square"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-mono font-medium" style={{ color: "#e2e8f0" }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

