
const LANGUAGE_COLOR_POOL = [
  "#1F77B4", // blue
  "#FF7F0E", // orange
  "#2CA02C", // green
  "#D62728", // red
  "#9467BD", // purple
  "#8C564B", // brown
  "#E377C2", // pink
  "#7F7F7F", // gray
  "#BCBD22", // olive
  "#17BECF", // cyan
];


const CVSS_COLOR_POOL = [
  "#c842f5", //Critical
  "#D62728", // High
  "#FF7F0E", // Medium
  "#2CA02C", // Low
  "#5f5d5d", // Unknow
];

function hexToRgba(hex, alpha = 0.7) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const CVSS_BG_COLOR_POOl = CVSS_COLOR_POOL.map(c => hexToRgba(c, 0.6));

const LANGUAGE_BG_COLOR_POOl = LANGUAGE_COLOR_POOL.map(c => hexToRgba(c, 0.6));

const COLOR_POOL = {
  language: LANGUAGE_COLOR_POOL,
  cvss: CVSS_COLOR_POOL,
  cvss_bg : CVSS_BG_COLOR_POOl,
  lan_bg: LANGUAGE_BG_COLOR_POOl,
};

export default COLOR_POOL
