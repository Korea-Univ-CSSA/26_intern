import React from "react";
import { Container, Typography, Card, CardContent, Box } from "@mui/material";
import { useMemo } from "react";
import Sunburst from "react-sunburst-chart";
import COLOR_POOL from "./color_pool";

const CVSS_COLOR_MAP = {
  Critical: COLOR_POOL.cvss[0],
  High: COLOR_POOL.cvss[1],
  Medium: COLOR_POOL.cvss[2],
  Low: COLOR_POOL.cvss[3],
  Unknown: COLOR_POOL.cvss[4],
};

const getLanguageColor = (index) =>
  COLOR_POOL.language[index % COLOR_POOL.language.length];

export const TestGround = ({ cvssData, pieCweData }) => {
  /* =========================
     CVE → CWE MAP
  ========================= */
  const cveToCwe = useMemo(() => {
    const map = {};
    for (const item of pieCweData) {
      const cve = item.value2?.[0];
      const cwe = item.x2;
      if (cve && cwe) map[cve] = cwe;
    }
    return map;
  }, [pieCweData]);

  /* =========================
     DATA MAKER
  ========================= */
  const dataMaker = (cvssData) => {
    const root = {
      name: "main",
      color: COLOR_POOL.main ?? "#999",
      children: [],
    };

    // year → severity → Set(CWE)
    const yearMap = {};

    for (const sev of cvssData) {
      if (!sev.value) continue;

      for (const cve of sev.cves) {
        const year = cve.split("-")[1];
        const cwe = cveToCwe[cve];

        if (!yearMap[year]) yearMap[year] = {};
        if (!yearMap[year][sev.name]) yearMap[year][sev.name] = new Set();

        if (cwe) yearMap[year][sev.name].add(cwe);
      }
    }

    /* =========================
       BUILD TREE WITH COLORS
    ========================= */
    let yearIndex = 0;

    for (const [year, severities] of Object.entries(yearMap)) {
      const yearColor = getLanguageColor(yearIndex++);

      const yearNode = {
        name: year,
        color: yearColor, // using language color
        children: [],
      };

      for (const [severity, cwes] of Object.entries(severities)) {
        const severityColor =
          CVSS_COLOR_MAP[severity] ?? CVSS_COLOR_MAP.Unknown;

        yearNode.children.push({
          name: severity,
          color: severityColor, // CVSS color
          children: [...cwes].map((cwe, idx) => ({
            name: cwe,
            color: yearColor, // using language color for leaf
            size: 1,
          })),
        });
      }

      root.children.push(yearNode);
    }

    return root;
  };

  const finalData = useMemo(() => dataMaker(cvssData), [cvssData]);

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "rgb(247, 243, 236)",
          justifyContent: "center",
          width: "100%",
          py: 6,
          mb: 4,
        }}
      >
        <Box sx={{ width: "1000px", px: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Now testing : Sunburst
          </Typography>
        </Box>
      </Box>

      <Container sx={{ width: "1000px", mb: 6 }}>
        {/* DEBUG VIEW */}
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
              {JSON.stringify(finalData, null, 2)}
            </Box>
          </CardContent>
        </Card>

        {/* SUNBURST */}
        <Card sx={{ p: 3, border: "1px solid #ccc" }}>
          <Sunburst
            data={finalData}
            width={500}
            height={500}
            children="children"
            label="name"
            size="size"
            color="color"
            excludeRoot
            sort={(a, b) => b.value - a.value}
            radiusScaleExponent={0.7}
            minSliceAngle={0.6}
            labelOrientation="radial"
            handleNonFittingLabel={() => null}
          />
        </Card>
      </Container>
    </>
  );
};

export default TestGround;
