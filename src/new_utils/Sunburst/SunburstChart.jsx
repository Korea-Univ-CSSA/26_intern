import React, { useMemo, useState } from "react";
import {
  Container,
  Typography,
  Card,
  Box,
  CssBaseline,
  Stack,
  CardContent,
} from "@mui/material";
import { interpolateViridis } from "d3-scale-chromatic";
import Sunburst from "react-sunburst-chart";
import COLOR_POOL from "../color_pool";
import DATASETS from "../testData";

const useTestData = false; // change to false for real data

/* =========================
   COLOR MAPS
========================= */

const CVSS_COLOR_MAP = {
  Critical: COLOR_POOL.cvss[0],
  High: COLOR_POOL.cvss[1],
  Medium: COLOR_POOL.cvss[2],
  Low: COLOR_POOL.cvss[3],
  Unknown: COLOR_POOL.cvss[4],
};

const adjustColor = (hex, amount = 20) => {
  const col = hex.replace("#", "");
  const num = parseInt(col, 16);

  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

/* =========================
   PILL
========================= */
const Pill = ({ label, bg, color = "#fff", sx, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      px: 1.5,
      py: 0.45,
      borderRadius: 999,
      backgroundColor: bg,
      color,
      fontSize: "12px",
      fontWeight: 600,
      lineHeight: 1,
      display: "inline-flex",
      alignItems: "center",
      width: "fit-content",
      ...sx,
    }}
  >
    {label}
  </Box>
);

/* =========================
   SEGMENTED TAB
========================= */
const SegTab = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      cursor: "pointer",
      userSelect: "none",
    }}
  >
    <Pill
      label={label}
      bg={active ? "#1976d2" : "#eee"}
      color={active ? "#fff" : "#222"}
      sx={{
        px: 2,
        py: 0.6,
        fontWeight: 700,
      }}
    />
  </Box>
);

export const SunburstChart = ({ cvssData, pieCweData }) => {
  const [legendMode, setLegendMode] = useState("year");
  const [focusedNode, setFocusedNode] = useState(null);

  /* =========================
     VIRIDIS YEAR SCALE
  ========================= */
  const yearColorScale = useMemo(() => {
    const years = new Set();

    cvssData?.forEach((sev) => {
      sev.cves?.forEach((cve) => {
        const year = cve.split("-")[1];
        if (year) years.add(year);
      });
    });

    const sortedYears = [...years].sort();
    const n = sortedYears.length;

    const yearMap = {};

    sortedYears.forEach((year, index) => {
      const ratio = n > 1 ? index / (n - 1) : 0.5;

      // 🔥 Reverse + remove yellow
      const t = 0.85 - 0.7 * ratio;
      // Range becomes 0.85 → 0.15 (reversed, no extreme yellow)

      yearMap[year] = interpolateViridis(t);
    });

    return yearMap;
  }, [cvssData]);

  /* =========================
     CVE → CWE MAP
  ========================= */
  const cveToCwe = useMemo(() => {
    const map = {};
    for (const item of pieCweData ?? []) {
      const cve = item.value2?.[0];
      const cwe = item.x2;
      if (cve && cwe) map[cve] = cwe;
    }
    return map;
  }, [pieCweData]);

  /* =========================
     BUILD SUNBURST DATA
  ========================= */
  const dataMaker = (cvssDataInput) => {
    const root = { name: "main", children: [] };

    // severity → year → Set(CWE)
    const severityMap = {};

    for (const sev of cvssDataInput ?? []) {
      if (!sev?.value) continue;

      if (!severityMap[sev.name]) severityMap[sev.name] = {};

      for (const cve of sev.cves ?? []) {
        const year = cve.split("-")[1];
        const cwe = cveToCwe[cve];

        if (!severityMap[sev.name][year])
          severityMap[sev.name][year] = new Set();

        if (cwe) severityMap[sev.name][year].add(cwe);
      }
    }

    /* =========================
       BUILD TREE
    ========================= */
    for (const [severity, years] of Object.entries(severityMap)) {
      const severityColor = CVSS_COLOR_MAP[severity] ?? CVSS_COLOR_MAP.Unknown;

      const severityNode = {
        name: severity,
        color: severityColor,
        children: [],
      };

      for (const [year, cwes] of Object.entries(years)) {
        const yearColor = yearColorScale[year] || "#999";

        const yearNode = {
          name: year,
          color: yearColor,
          children: [...cwes].map((cwe) => ({
            name: cwe,
            color: adjustColor(yearColor, 25),
            size: 1,
          })),
        };

        severityNode.children.push(yearNode);
      }

      root.children.push(severityNode);
    }

    return root;
  };

  const finalData = useMemo(() => {
    if (useTestData) return DATASETS.sunburst;
    return dataMaker(cvssData);
  }, [cvssData, cveToCwe, yearColorScale]);

  const focusedData = useMemo(() => {
    if (!focusedNode) return finalData;

    const children = finalData?.children ?? [];

    // If CVSS level
    const cvssMatch = children.find((node) => node.name === focusedNode);
    if (cvssMatch) {
      return {
        name: "main",
        children: [cvssMatch],
      };
    }

    // If Year level — collect ALL severities containing that year
    const matchedSeverities = [];

    for (const severityNode of children) {
      const yearChildren = severityNode?.children ?? [];

      const yearMatch = yearChildren.find(
        (yearNode) => yearNode.name === focusedNode,
      );

      if (yearMatch) {
        matchedSeverities.push({
          ...severityNode,
          children: [yearMatch],
        });
      }
    }

    if (matchedSeverities.length > 0) {
      return {
        name: "main",
        children: matchedSeverities,
      };
    }

    // If CWE level
    for (const severityNode of children) {
      const yearChildren = severityNode?.children ?? [];
      for (const yearNode of yearChildren) {
        const cweChildren = yearNode?.children ?? [];
        const cweMatch = cweChildren.find(
          (cweNode) => cweNode.name === focusedNode,
        );
        if (cweMatch) {
          return {
            name: "main",
            children: [
              {
                ...severityNode,
                children: [
                  {
                    ...yearNode,
                    children: [cweMatch],
                  },
                ],
              },
            ],
          };
        }
      }
    }

    return finalData;
  }, [focusedNode, finalData]);

  /* =========================
     CWE COLOR MAP (match sunburst)
  ========================= */
  const cweColorMap = useMemo(() => {
    const map = {};
    const severityNodes = finalData?.children ?? [];

    severityNodes.forEach((severityNode) => {
      (severityNode.children ?? []).forEach((yearNode) => {
        (yearNode.children ?? []).forEach((cweNode) => {
          map[cweNode.name] = cweNode.color;
        });
      });
    });

    return map;
  }, [finalData]);

  const globalYearMap = useMemo(() => {
    const map = {};
    const severityNodes = finalData?.children ?? [];

    severityNodes.forEach((severityNode) => {
      (severityNode.children ?? []).forEach((yearNode) => {
        if (!map[yearNode.name]) {
          map[yearNode.name] = {
            color: yearNode.color,
            cwes: new Set(),
          };
        }

        (yearNode.children ?? []).forEach((cweNode) => {
          map[yearNode.name].cwes.add(cweNode.name);
        });
      });
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, data]) => ({
        year,
        color: data.color,
        cwes: [...data.cwes],
      }));
  }, [finalData]);

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      <CssBaseline />

      <Container
        disableGutters
        sx={{
          width: 1100,
          mx: "auto",
          mt: 4,
          mb: 6,
        }}
      >
        {/* DEBUG VIEW - change true/false to show debug view*/}
        {true && (
          <Card sx={{ p: 3, border: "1px solid #ccc", mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Debug: Final Data (Tree)
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: "#0f172a",
                  color: "#e5e7eb",
                  p: 2,
                  fontSize: "12px",
                  borderRadius: 1,
                  maxHeight: 400,
                  overflow: "auto",
                }}
              >
                {JSON.stringify(
                  finalData,
                  (key, value) => {
                    if (key === "__dataNode") return undefined;
                    return value;
                  },
                  2,
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        <Card sx={{ p: 3 }}>
          <Stack direction="row" spacing={3} alignItems="flex-start">
            {/* ===== SUNBURST ===== */}
            <Box
              sx={{
                flex: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Sunburst
                key={focusedNode || "default"}
                data={focusedData}
                width={500}
                height={500}
                label="name"
                size="size"
                color="color"
                excludeRoot
                centerRadius={0.22}
                radiusScaleExponent={1.15}
                maxLevels={3}
              />
            </Box>

            {/* ===== LEGEND (Tabs + Panel) ===== */}
            <Box sx={{ flex: 1, maxWidth: 320 }}>
              {/* Segmented tab bar container */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 0.75,
                  borderRadius: 999,
                  backgroundColor: "#f3f4f6",
                  width: "fit-content",
                  mb: 1.25,
                }}
              >
                <SegTab
                  label="CVSS"
                  active={legendMode === "cvss"}
                  onClick={() => {
                    setLegendMode("cvss");
                    setFocusedNode(null);
                  }}
                />
                <SegTab
                  label="Year"
                  active={legendMode === "year"}
                  onClick={() => {
                    setLegendMode("year");
                    setFocusedNode(null);
                  }}
                />
                <SegTab
                  label="CWE"
                  active={legendMode === "cwe"}
                  onClick={() => {
                    setLegendMode("cwe");
                    setFocusedNode(null);
                  }}
                />
              </Box>

              <Box
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  p: 1.5,
                  height: 420,
                  overflowY: "auto",
                }}
              >
                {/* ========================= CVSS PANEL (ROOT LEVEL) ========================= */}
                {legendMode === "cvss" && (
                  <Stack spacing={2}>
                    {Object.keys(CVSS_COLOR_MAP).map((severity) => {
                      const cvssNode = (finalData?.children ?? []).find(
                        (node) => node.name === severity,
                      );

                      const totalYear = cvssNode?.children?.length ?? 0;

                      return (
                        <Stack key={severity} spacing={1}>
                          <Pill
                            label={`${severity} (${totalYear})`}
                            bg={CVSS_COLOR_MAP[severity]}
                            sx={{ cursor: "pointer" }}
                            onClick={() => setFocusedNode(severity)}
                          />

                          {cvssNode?.children?.length > 0 && (
                            <Stack spacing={0.8} sx={{ pl: 2 }}>
                              {cvssNode.children.map((yearNode) => (
                                <Pill
                                  key={yearNode.name}
                                  label={`${yearNode.name} (${yearNode.children?.length ?? 0})`}
                                  bg={yearNode.color}
                                  sx={{
                                    cursor: "pointer",
                                    fontSize: "11px",
                                    px: 1.4,
                                    py: 0.35,
                                    opacity: 0.9,
                                  }}
                                  onClick={() => setFocusedNode(yearNode.name)}
                                />
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      );
                    })}
                  </Stack>
                )}

                {/* ========================= YEAR PANEL ========================= */}
                {legendMode === "year" && (
                  <Stack spacing={2}>
                    {globalYearMap.map((yearNode) => {
                      const totalCwe = yearNode.cwes?.length ?? 0;

                      return (
                        <Stack key={yearNode.year} spacing={1}>
                          <Pill
                            label={`${yearNode.year} (${totalCwe})`}
                            bg={yearNode.color}
                            sx={{
                              cursor: "pointer",
                              fontSize: "13px",
                              px: 2,
                              py: 0.6,
                            }}
                            onClick={() => setFocusedNode(yearNode.year)}
                          />

                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            gap={0.8}
                            sx={{ pl: 2 }}
                          >
                            {yearNode.cwes.map((cwe) => (
                              <Pill
                                key={cwe}
                                label={cwe}
                                bg={cweColorMap[cwe] ?? "#9ca3af"}
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "10.5px",
                                  px: 1.2,
                                  py: 0.3,
                                }}
                                onClick={() => setFocusedNode(cwe)}
                              />
                            ))}
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Stack>
                )}

                {/* ========================= CWE PANEL (LEAF LEVEL) ========================= */}
                {legendMode === "cwe" && (
                  <Stack spacing={1.5}>
                    {Object.entries(cveToCwe).map(([cve, cwe]) => (
                      <Box key={cve}>
                        <Pill
                          label={cwe}
                          bg={cweColorMap[cwe] ?? "#9ca3af"}
                          sx={{ cursor: "pointer" }}
                          onClick={() => setFocusedNode(cwe)}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {cve}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>
          </Stack>
        </Card>
      </Container>
    </>
  );
};

export default SunburstChart;
