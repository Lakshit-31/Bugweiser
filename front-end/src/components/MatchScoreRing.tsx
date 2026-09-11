import React from 'react';

interface MatchScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

export default function MatchScoreRing({
  score,
  size = 56,
  strokeWidth = 4,
  animated = true,
}: MatchScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 85 ? '#4CAF50' : score >= 65 ? '#E3A008' : '#B5482F';
  const bgColor = score >= 85 ? 'rgba(76, 175, 80, 0.2)' : score >= 65 ? '#FDF6E3' : '#F8E8E3';

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: animated ? 'stroke-dashoffset 1s ease-out' : 'none' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span
          className="font-sans text-base font-extrabold leading-none text-white drop-shadow-sm"
          style={{ color: score >= 85 ? '#FFFFFF' : color }}
        >
          {score}
        </span>
        <span className="text-[9px] font-bold text-marigold-300 uppercase tracking-tight">Match</span>
      </div>
    </div>
  );
}
