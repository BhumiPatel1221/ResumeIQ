import React from 'react';

interface ResumeIQLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { height: 22, fontSize: 20 },
  md: { height: 28, fontSize: 26 },
  lg: { height: 40, fontSize: 38 },
};

export const ResumeIQLogo: React.FC<ResumeIQLogoProps> = ({ size = 'md', className = '' }) => {
  const { height, fontSize } = sizeMap[size];
  // Approximate width based on character count and font size
  const width = fontSize * 5.8;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height + 6}`}
      height={height + 6}
      className={className}
      aria-label="ResumeIQ"
    >
      {/* "Resume" — soft white */}
      <text
        x="0"
        y={height}
        fill="#F5F2E8"
        fontFamily="'DM Sans', 'Inter', system-ui, sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        Resume
      </text>

      {/* "I" — neon green */}
      <text
        x={fontSize * 3.72}
        y={height}
        fill="#C6FF00"
        fontFamily="'DM Sans', 'Inter', system-ui, sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        I
      </text>

      {/* "Q" — neon green */}
      <text
        x={fontSize * 4.02}
        y={height}
        fill="#C6FF00"
        fontFamily="'DM Sans', 'Inter', system-ui, sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        Q
      </text>

      {/* Diagonal arrow (↗) at top-right of "Q" — symbolizing growth */}
      <g transform={`translate(${fontSize * 5.0}, ${height * 0.18})`}>
        {/* Diagonal line going bottom-left to top-right */}
        <line
          x1={-fontSize * 0.12}
          y1={fontSize * 0.18}
          x2={fontSize * 0.14}
          y2={-fontSize * 0.1}
          stroke="#C6FF00"
          strokeWidth={fontSize * 0.08}
          strokeLinecap="round"
        />
        {/* Arrowhead at top-right */}
        <polyline
          points={`${fontSize * 0.02},${-fontSize * 0.1} ${fontSize * 0.14},${-fontSize * 0.1} ${fontSize * 0.14},${fontSize * 0.02}`}
          fill="none"
          stroke="#C6FF00"
          strokeWidth={fontSize * 0.08}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
