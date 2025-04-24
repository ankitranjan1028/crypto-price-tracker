// src/components/SparklineChart.jsx
import { memo } from 'react';

const SparklineChart = ({ data, color = '#10B981', width = 120, height = 40 }) => {
  if (!data || data.length === 0) {
    return <div>No chart data</div>;
  }

  // Find min and max for scaling
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Prevent division by zero

  // Scale the data points to fit the height
  const scaledData = data.map(value => height - ((value - min) / range * height));
  
  // Calculate points for the SVG path
  const points = scaledData.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    return `${x},${point}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default memo(SparklineChart);