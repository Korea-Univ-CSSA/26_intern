import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Chip,
  Typography,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { customAxios } from "../../utils/CustomAxios";
import BubbleModal from "../Bubble/BubbleModal";
import COLOR_POOL from "../color_pool";

const jiggleRotateOnce = keyframes`
  0% { transform: translate(0,0) rotate(0deg); }
  25% { transform: translate(-2px,-2px) rotate(-2deg); }
  50% { transform: translate(2px,2px) rotate(2deg); }
  75% { transform: translate(-1px,1px) rotate(-1deg); }
  100% { transform: translate(0,0) rotate(0deg); }
`;

// -------- helper: match Label based on CVSS number --------
const getCvssLabel = (score) => {
  const num = parseFloat(score);
  if (isNaN(num) || num <= 0) return "Unknown";
  if (num < 4) return "Low";
  if (num < 7) return "Medium";
  if (num < 9) return "High";
  return "Critical";
};

const CVSS_LIST = ["Critical", "High", "Medium", "Low", "Unknown"];

const CVSS_MAP = {
  Critical: 0,
  High: 0,
  Medium: 0,
  Low: 0,
  Unknown: 0,
};

// -------- helper: get "corresponding color --------
const getCvssColor = (cvss, all) => {
  const idx = all.indexOf(cvss);
  return COLOR_POOL.cvss[idx % COLOR_POOL.cvss.length];
};

// -------- shared card style  --------
const filterCard = {
  border: "1px solid #e0e0e0",
  borderRadius: 2,
  padding: 1.5,
  backgroundColor: "#fafafa",
};

// -------- Start of the CveFilters component --------

const CveFilters = ({ filters, onChange, availableYears }) => {
  const [animate, setAnimate] = useState(true);
  const [cvssCounts, setCvssCounts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  {
    /* ---------- API call for CVE Bubble Chart ---------- */
  }
  useEffect(() => {
    const fetchCvssCounts = async () => {
      try {
        const res = await customAxios.get("/api/search/vdb/all");
        const counts = { ...CVSS_MAP };

        res.data.forEach((item) => {
          const label = getCvssLabel(item.cvss);
          counts[label] += 1;
        });

        setCvssCounts(counts);
      } catch (err) {
        console.error("Failed to fetch CVSS counts:", err);
      }
    };

    fetchCvssCounts();
  }, []);

  const toggleCVSS = (level) => {
    const next = filters.cvss.includes(level)
      ? filters.cvss.filter((c) => c !== level)
      : [...filters.cvss, level];

    onChange({ ...filters, cvss: next });
  };

  {
    /* ----------------- Animation Timeout ----------------- */
  }
  useEffect(() => {
    const t = setTimeout(() => setAnimate(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ----------------- Filter Grid ----------------- */}
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
          marginBottom: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1.5fr 0.8fr 1.7fr",
          },
          alignItems: "start",
        }}
      >
        {/* ----------------- Search ----------------- */}
        <Box sx={filterCard}>
          <Typography variant="body2" gutterBottom>
            Search
          </Typography>
          <TextField
            label="Search CVE or Function Name"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            fullWidth
          />
        </Box>

        {/* ----------------- Year ----------------- */}
        <Box sx={filterCard}>
          <Typography variant="body2" gutterBottom>
            Year
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.year}
              label="Year"
              onChange={(e) => onChange({ ...filters, year: e.target.value })}
              MenuProps={{
                PaperProps: { style: { maxHeight: 220 } },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* ----------------- CVSS ----------------- */}
        <Box sx={filterCard}>
          <Button
            variant="text"
            sx={{
              typography: "body2",
              textTransform: "none",
              px: 1.25,
              py: 0.5,
              mb: 1,
              borderRadius: 1,
              cursor: "pointer",

              backgroundColor: COLOR_POOL.main[0],
              color: "white",

              "&:hover": {
                backgroundColor: COLOR_POOL.main[1],
              },
              animation: animate
                ? `${jiggleRotateOnce} 600ms ease-out`
                : "none",
            }}
            onClick={() => setModalOpen(true)}
          >
            CVSS
          </Button>

          <Box>
            {CVSS_LIST.map((level) => {
              const isSelected = filters.cvss.includes(level);
              const color = getCvssColor(level, CVSS_LIST);

              return (
                <Chip
                  key={level}
                  label={level}
                  clickable
                  onClick={() => toggleCVSS(level)}
                  sx={{
                    mr: 0.5,
                    mb: 0.5,
                    border: `1px solid ${color}`,
                    backgroundColor: isSelected ? color : "transparent",
                    color: isSelected ? "#fff" : "text.primary",
                    "&:hover": {
                      backgroundColor: isSelected ? color : `${color}22`,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* ----------------- Bubble Modal ----------------- */}
      <BubbleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={cvssCounts}
        color_pool={COLOR_POOL.cvss}
      />
    </>
  );
};

export default CveFilters;
