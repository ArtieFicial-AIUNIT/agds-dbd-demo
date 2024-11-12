import { Box } from '@ag.ds-next/react/box';
import { Stack } from '@ag.ds-next/react/stack';
import { Text } from '@ag.ds-next/react/text';
import { useState } from 'react';

type DataPoint = {
    month: string;
    cost: number;
};

interface SimpleChartProps {
    data: DataPoint[];
    marketName: string;
    color: string;
}

export const SimpleChart = ({ data, marketName, color }: SimpleChartProps) => {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    
    // Calculate chart dimensions
    const width = 800;
    const height = 300;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    // Calculate scales
    const maxCost = Math.max(...data.map(d => d.cost));
    const minCost = Math.min(...data.map(d => d.cost));
    const yScale = (cost: number) => 
        chartHeight - ((cost - minCost) / (maxCost - minCost)) * chartHeight + padding;
    const xScale = (index: number) => 
        (index / (data.length - 1)) * chartWidth + padding;

    // Generate path
    const linePath = data
        .map((point, i) => {
            const x = xScale(i);
            const y = yScale(point.cost);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');

    return (
        <Stack gap={0.5}>
            <Text weight="bold">{marketName}</Text>
            <Box position="relative" height={height}>
                <svg width={width} height={height}>
                    {/* Grid lines */}
                    <line
                        x1={padding}
                        y1={padding}
                        x2={padding}
                        y2={height - padding}
                        stroke="#ccc"
                        strokeWidth={1}
                    />
                    <line
                        x1={padding}
                        y1={height - padding}
                        x2={width - padding}
                        y2={height - padding}
                        stroke="#ccc"
                        strokeWidth={1}
                    />

                    {/* Cost labels */}
                    {[minCost, (minCost + maxCost) / 2, maxCost].map((cost, i) => {
                        const label = `$${cost.toFixed(2)}`;
                        return (
                            <text
                                key={i}
                                x={padding - 5}
                                y={yScale(cost)}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                fontSize={12}
                                fill="#666"
                            >
                                {label}
                            </text>
                        );
                    })}

                    {/* Month labels */}
                    {data.map((point, i) => {
                        const label = point.month;
                        return (
                            <text
                                key={i}
                                x={xScale(i)}
                                y={height - padding + 20}
                                textAnchor="middle"
                                fontSize={10}
                                fill="#666"
                                transform={`rotate(45, ${xScale(i)}, ${height - padding + 20})`}
                            >
                                {label}
                            </text>
                        );
                    })}

                    {/* Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                    />

                    {/* Interactive points */}
                    {data.map((point, i) => (
                        <g key={i}>
                            <circle
                                cx={xScale(i)}
                                cy={yScale(point.cost)}
                                r={hoveredPoint === i ? 6 : 4}
                                fill={color}
                                onMouseEnter={() => setHoveredPoint(i)}
                                onMouseLeave={() => setHoveredPoint(null)}
                                style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
                            />
                            {hoveredPoint === i && (
                                <g>
                                    <rect
                                        x={xScale(i) - 45}
                                        y={yScale(point.cost) - 30}
                                        width={90}
                                        height={20}
                                        fill="white"
                                        stroke={color}
                                        rx={4}
                                    />
                                    <text
                                        x={xScale(i)}
                                        y={yScale(point.cost) - 15}
                                        textAnchor="middle"
                                        fontSize={12}
                                        fill="#000"
                                    >
                                        ${point.cost.toFixed(2)} AUD
                                    </text>
                                </g>
                            )}
                        </g>
                    ))}
                </svg>
            </Box>
        </Stack>
    );
};
