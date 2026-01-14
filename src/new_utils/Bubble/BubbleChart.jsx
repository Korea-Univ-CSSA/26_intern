// BubbleChart.jsx
import React, { useState, useRef, useEffect } from "react";
import { forceSimulation, forceCenter, forceCollide } from "d3-force";


const MIN_RADIUS = 40;
const MAX_RADIUS = 90;

const PAN_SPEED = 1.8;

const ZOOM_IN_SPEED = 1.15; 
const ZOOM_OUT_SPEED = 0.88;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

const BubbleChart = ({ data, colors, width = 1200, height = 900 }) => {
  if (!data) return null;

  const nodes = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  const total = nodes.reduce((sum, d) => sum + d.value, 0);
  const maxValue = Math.max(...nodes.map((d) => d.value));

  const simulationNodes = nodes.map((d) => ({
    ...d,
    r: Math.max(
      MIN_RADIUS,
      Math.min(MAX_RADIUS, (d.value / maxValue) * 70 + 30)
    ),
    percent: total > 0 ? (d.value / total) * 100 : 0,
  }));


  const simulation = forceSimulation(simulationNodes)
    .force("center", forceCenter(width / 2, height / 2))
    .force(
      "collision",
      forceCollide((d) => d.r + 4)
    )
    .stop();

  for (let i = 0; i < 250; i++) simulation.tick();

  /* =========================
     ZOOM + PAN STATE
  ========================= */
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const svgRef = useRef(null);

  /* =========================
    Distance Based Zooming
  ========================= */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleWheel = (e) => {
      e.preventDefault();

      setScale((prev) => {
        let next;

        // Asymmetric zoom
        if (e.deltaY < 0) {
          // zoom in (faster)
          next = prev * ZOOM_IN_SPEED;
        } else {
          // zoom out (slower)
          next = prev * ZOOM_OUT_SPEED;
        }

        // Clamp
        return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      });
    };

    svg.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      svg.removeEventListener("wheel", handleWheel);
    };
  }, []);

  /* =========================
     PANNING
  ========================= */
  const onMouseDown = (e) => {
    e.preventDefault();
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!isPanning.current) return;
    e.preventDefault();

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    setOffset((o) => ({
      x: o.x + (dx * PAN_SPEED) / scale,
      y: o.y + (dy * PAN_SPEED) / scale,
    }));

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        cursor: isPanning.current ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
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
            >
              <tspan
                x={d.x}
                dy="-0.9em"
                fontSize={Math.max(12, Math.min(16, d.r / 3))}
                fontWeight="bold"
                fill="#ffffff"
              >
                {d.name}
              </tspan>
              <tspan
                x={d.x}
                dy="1.2em"
                fontSize={Math.max(11, Math.min(14, d.r / 3.5))}
                fill="#ffffff"
              >
                {d.value.toLocaleString()}
              </tspan>
              <tspan
                x={d.x}
                dy="1.1em"
                fontSize={Math.max(10, Math.min(13, d.r / 4))}
                fill="#ffffff"
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
