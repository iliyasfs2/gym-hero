"use client";

import React, { useState } from "react";
import { calculatePreciseBMI } from "./bmiUtils";

interface BMIGaugeCardProps {
  height: number | null;
  weight: number | null;
}

const BMI_RANGES = [
  {
    id: "underweight",
    label: "Underweight",
    color: "#3b82f6",
    gradientId: "underweightGrad",
    startColor: "#3b82f6",
    endColor: "#10b981",
    pathD: "M 40 110 A 80 80 0 0 1 63.4 53.4",
  },
  {
    id: "normal",
    label: "Normal",
    color: "#10b981",
    gradientId: "normalGrad",
    startColor: "#10b981",
    endColor: "#eab308",
    pathD: "M 63.4 53.4 A 80 80 0 0 1 120 30",
  },
  {
    id: "overweight",
    label: "Overweight",
    color: "#eab308",
    gradientId: "overweightGrad",
    startColor: "#eab308",
    endColor: "#f97316",
    pathD: "M 120 30 A 80 80 0 0 1 176.6 53.4",
  },
  {
    id: "obese",
    label: "Obese",
    color: "#ef4444",
    gradientId: "obeseGrad",
    startColor: "#f97316",
    endColor: "#ef4444",
    pathD: "M 176.6 53.4 A 80 80 0 0 1 200 110",
  },
];

export function BMIGaugeCard({ height, weight }: BMIGaugeCardProps) {
  const bmiData = height && weight ? calculatePreciseBMI(height, weight) : null;
  const [hoveredSegment, setHoveredSegment] = useState<
    (typeof BMI_RANGES)[0] | null
  >(null);

  const minBMI = 15;
  const maxBMI = 35;

  let angle = -90;
  let activeRange = BMI_RANGES[1];

  if (bmiData) {
    const clampedBMI = Math.min(Math.max(bmiData.bmi, minBMI), maxBMI);
    const percentage = (clampedBMI - minBMI) / (maxBMI - minBMI);
    angle = -90 + percentage * 180;

    if (bmiData.bmi < 18.5) activeRange = BMI_RANGES[0];
    else if (bmiData.bmi < 25) activeRange = BMI_RANGES[1];
    else if (bmiData.bmi < 30) activeRange = BMI_RANGES[2];
    else activeRange = BMI_RANGES[3];
  }

  const currentDisplayRange = hoveredSegment || activeRange;

  return (
    <div className="bg-[#121824] border border-white/[0.06] p-6 rounded-3xl text-white flex flex-col justify-between h-full shadow-2xl overflow-hidden">
      <div className="flex justify-between items-center w-full z-10">
        <div>
          <h3 className="text-base font-bold text-slate-200">
            Body Mass Index
          </h3>
          <p className="text-[11px] text-slate-400">Health Indicator</p>
        </div>
        {bmiData && (
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase shadow-sm transition-all duration-300"
            style={{
              borderColor: `${currentDisplayRange.color}50`,
              color: currentDisplayRange.color,
              backgroundColor: `${currentDisplayRange.color}15`,
            }}
          >
            {currentDisplayRange.label}
          </span>
        )}
      </div>

      {bmiData ? (
        <div className="relative w-full my-auto flex flex-col items-center justify-center pt-3">
          <div className="w-full max-w-[320px] aspect-[2/1.15] relative flex items-center justify-center p-2">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 240 135"
            >
              <defs>
                {BMI_RANGES.map((range) => (
                  <linearGradient
                    key={range.gradientId}
                    id={range.gradientId}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={range.startColor} />
                    <stop offset="100%" stopColor={range.endColor} />
                  </linearGradient>
                ))}

                <filter
                  id="hoverGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <filter
                  id="needleGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="4"
                    floodColor="#000000"
                    floodOpacity="0.5"
                  />
                </filter>

                <linearGradient
                  id="needleGrad"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
              </defs>

              <path
                d="M 40 110 A 80 80 0 0 1 200 110"
                fill="none"
                stroke="#1e293b"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {BMI_RANGES.map((range) => {
                const isHovered = hoveredSegment?.id === range.id;

                return (
                  <path
                    key={range.id}
                    d={range.pathD}
                    fill="none"
                    stroke={`url(#${range.gradientId})`}
                    strokeWidth={isHovered ? "19" : "14"}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-300 ease-out"
                    style={{
                      opacity: hoveredSegment ? (isHovered ? 1 : 0.35) : 0.95,
                      filter: isHovered ? "url(#hoverGlow)" : "none",
                    }}
                    onMouseEnter={() => setHoveredSegment(range)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                );
              })}

              <g
                filter="url(#needleGlow)"
                className="pointer-events-none"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "120px 110px",
                  transition:
                    "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <polygon
                  points="118.5,110 121.5,110 120.8,36 119.2,36"
                  fill="url(#needleGrad)"
                />
                <circle
                  cx="120"
                  cy="36"
                  r="3.5"
                  fill={currentDisplayRange.color}
                  className="transition-colors duration-300"
                />
                <circle cx="120" cy="36" r="1.5" fill="#ffffff" />
              </g>

              <g className="pointer-events-none">
                <circle
                  cx="120"
                  cy="110"
                  r="12"
                  fill="rgba(255,255,255,0.03)"
                />
                <circle
                  cx="120"
                  cy="110"
                  r="9"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <circle
                  cx="120"
                  cy="110"
                  r="4"
                  fill={currentDisplayRange.color}
                  className="transition-colors duration-300"
                />
                <circle cx="120" cy="110" r="1.5" fill="#ffffff" />
              </g>
            </svg>
          </div>

          <div className="text-center mt-2 z-10">
            <span className="text-4xl font-black text-white tracking-tight">
              {bmiData.bmi.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-widest mt-0.5">
              BMI (kg/m²)
            </span>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 text-xs my-auto">
          Set height and weight in profile to view BMI.
        </div>
      )}

      <div className="w-full flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-white/[0.06] z-10">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: currentDisplayRange.color }}
          ></span>
          <span>{currentDisplayRange.label} Range</span>
        </div>
        <span className="text-slate-500">WHO Standard</span>
      </div>
    </div>
  );
}
