import React, { useEffect, useRef } from "react";
import {
  forceRadial,
  forceSimulation,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
} from "d3-force";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import { scalePow } from "d3-scale";

const MIN_RADIUS = 40;
const MAX_RADIUS = 90;

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

// visual bias
const CAMERA_NUDGE = { x: -150, y: -100 };

const BubbleChart = ({ data, colors, width = 1200, height = 900 }) => {
  if (!data) return null;

  const svgRef = useRef(null);
  const gRef = useRef(null);

  /* =========================
     BUILD NODES
  ========================= */
  const nodes = Object.entries(data).map(([name, value]) => ({ name, value }));

  const total = nodes.reduce((sum, d) => sum + d.value, 0);
  const maxValue = Math.max(...nodes.map((d) => d.value));

  const minValue = Math.min(...nodes.map((d) => d.value));

  const radialScale = (value) => {
    // bigger value → smaller radius → closer to center
    return (
      ((maxValue - value) / (maxValue - minValue || 1)) *
      Math.min(width, height) *
      0.3
    );
  };

  const rScale = scalePow()
    .exponent(0.6) 
    .domain([0, maxValue])
    .range([MIN_RADIUS, MAX_RADIUS]);

  const simulationNodes = nodes.map((d) => ({
    ...d,
    r: rScale(d.value),
    percent: total > 0 ? (d.value / total) * 100 : 0,
  }));

  /* =========================
     FORCE SIMULATION
  ========================= */
  const simulation = forceSimulation(simulationNodes)
    .force("center", forceCenter(width / 2, height / 2))
    .force(
      "radial",
      forceRadial((d) => radialScale(d.value), width / 2, height / 2).strength(
        0.35,
      ), 
    )
    .force(
      "collision",
      forceCollide((d) => d.r + 6),
    )
    .force("x", forceX(width / 2).strength(0.03))
    .force("y", forceY(height / 2).strength(0.03))
    .stop();

  for (let i = 0; i < 250; i++) simulation.tick();

  /* =========================
     COMPUTE TRUE CENTER
  ========================= */
  const centroid = simulationNodes.reduce(
    (acc, d) => {
      acc.x += d.x;
      acc.y += d.y;
      return acc;
    },
    { x: 0, y: 0 },
  );

  centroid.x /= simulationNodes.length;
  centroid.y /= simulationNodes.length;

  /* =========================
     D3 ZOOM + PAN
  ========================= */
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = select(svgRef.current);
    const g = select(gRef.current);

    const baseTransform = zoomIdentity
      .translate(
        width / 2 - centroid.x + CAMERA_NUDGE.x,
        height / 2 - centroid.y + CAMERA_NUDGE.y,
      )
      .scale(1);

    const zoomBehavior = zoom()
      .scaleExtent([MIN_SCALE, MAX_SCALE])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);
    svg.call(zoomBehavior.transform, baseTransform);

    return () => {
      svg.on(".zoom", null);
    };
  }, [width, height]);

  /* =========================
     RENDER
  ========================= */
  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <g ref={gRef}>
        {simulationNodes.map((d, i) => (
          <g key={i}>
            <circle
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill={colors[i % colors.length]}
              stroke="#333"
            />
            <text
              x={d.x}
              y={d.y}
              textAnchor="middle"
              dominantBaseline="middle"
              pointerEvents="none"
              fill="#fff"
            >
              <tspan
                x={d.x}
                dy="-0.9em"
                fontSize={Math.max(15, Math.min(16, d.r / 3))}
                fontWeight="bold"
              >
                {d.name}
              </tspan>
              <tspan
                x={d.x}
                dy="1.2em"
                fontSize={Math.max(16, Math.min(14, d.r / 3.5))}
              >
                {d.value.toLocaleString()}
              </tspan>
              <tspan
                x={d.x}
                dy="1.1em"
                fontSize={Math.max(16, Math.min(13, d.r / 4))}
              >
                ({d.percent.toFixed(1)}%)
              </tspan>
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default BubbleChart;
