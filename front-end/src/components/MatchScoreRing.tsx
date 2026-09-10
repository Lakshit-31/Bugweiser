interface MatchScoreRingProps {
  score: number;
  size?: number;
}

export default function MatchScoreRing({ score, size = 56 }: MatchScoreRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 85 ? '#2F5233' : score >= 65 ? '#E3A008' : '#B5482F';
  const bgColor = score >= 85 ? '#EAF1EC' : score >= 65 ? '#FDF6E3' : '#F8E8E3';

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
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <span
        className="absolute font-sans text-sm font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
