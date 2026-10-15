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
    if (percentage >= 80) return "#003c33"; // Cohere Deep Green
    if (percentage >= 50) return "#1863dc"; // Cohere Action Blue
    if (percentage >= 25) return "#ff7759"; // Cohere Coral
    return "#b30000"; // Cohere Error Red
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#eeece7"
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
        <span className="text-[11px] font-mono font-medium text-ink">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

