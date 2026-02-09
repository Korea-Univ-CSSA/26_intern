const LANGUAGE_COLOR_POOL = [
  "#4E79A7", // steel blue
  "#b2ca38", // teal-green
  "#76B7B2", // soft cyan
  "#B07AA1", // muted purple
  "#9C755F", // taupe
  "#BAB0AC", // warm gray
  "#86BCB6", // desaturated mint
  "#6B6ECF", // indigo
  "#8CD17D", // pale green (NOT severity green)
  "#D4A6C8", // dusty pink
];

const SUNBURST_OUTER = [
  "#264653", // deep blue-gray
  "#7D4F50", // dusty maroon
  "#3A5A40", // dark moss
  "#4A4E69", // slate violet
  "#6B705C", // olive stone
  "#6A4C93", // royal purple
  "#8D5A97", // muted magenta
  "#5F7161", // forest gray-green
  "#9A6D38", // antique bronze

  "#495867", // steel night
];

const CVSS_COLOR_POOL = [
  "#c842f5", //Critical
  "#D62728", // High
  "#FF7F0E", // Medium
  "#2CA02C", // Low
  "#5f5d5d", // Unknow
];

const MAIN_THEME = [
  "#C23E3E", // Main color - crisom
  "#862020", // Secondary colr - dark crisom
];
function hexToRgba(hex, alpha = 0.7) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const CVSS_BG_COLOR_POOl = CVSS_COLOR_POOL.map((c) => hexToRgba(c, 0.6));

const LANGUAGE_BG_COLOR_POOl = LANGUAGE_COLOR_POOL.map((c) =>
  hexToRgba(c, 0.6),
);

const COLOR_POOL = {
  language: LANGUAGE_COLOR_POOL,
  cvss: CVSS_COLOR_POOL,
  cvss_bg: CVSS_BG_COLOR_POOl,
  lan_bg: LANGUAGE_BG_COLOR_POOl,
  sunburst: SUNBURST_OUTER,
  main: MAIN_THEME,
};

export default COLOR_POOL;
