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

const jiggleRotateOnce = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  15% {
    transform: translate(-2px, -2px) rotate(-2deg);
  }
  30% {
    transform: translate(2px, -2px) rotate(2deg);
  }
  45% {
    transform: translate(2px, 2px) rotate(-2deg);
  }
  60% {
    transform: translate(-2px, 2px) rotate(2deg);
  }
  75% {
    transform: translate(1px, -1px) rotate(-1deg);
  }
  90% {
    transform: translate(-1px, 1px) rotate(1deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
`;

const CVSS_COLOR_POOL = [
  "#c842f5", //Critical

  "#D62728", // High

  "#FF7F0E", // Medium

  "#2CA02C", // Low

  "#5f5d5d", // Unknow
];

const CVSS_LIST = ["Critical", "High", "Mediun", "Low", "Unknown"];

const CVSS_MAP = {
  Unknown: 0,
  Low: 0,
  Medium: 0,
  High: 0,
  Critical: 0,
};

const getCvssColor = (cvss, allCVss) => {
  const index = allCVss.indexOf(cvss);
  return CVSS_COLOR_POOL[index % CVSS_COLOR_POOL.length];
};

const CveFilters = ({ filters, onChange, availableYears }) => {
  const [animate, setAnimate] = useState(true);
  const [cveCounts, setCveCounts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const handleModal = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCvssCounts = async () => {
      try {
        const res = await customAxios.get("/api/search/vdb/all");

        console.log("First 30 API entries:", res.data.slice(0, 30));

        // 1️⃣ Initialize counts (clone, not reference)
        const counts = { ...CVSS_MAP };

        // 2️⃣ Count by computed CVSS label
        res.data.forEach((item) => {
          const label = getCvssLabel(item.cvss);
          counts[label] += 1;
        });

        // 3️⃣ Save to state
        setCvssCounts(counts);
      } catch (err) {
        console.error("Failed to fetch CVSS counts:", err);
      }
    };

    fetchCvssCounts();
  }, []);

  const toggleCVSS = (cvss) => {
    const next = filters.cvss.includes(cvss)
      ? filters.cvss.filter((c) => c !== cvss)
      : [...filters.cvss, cvss];

    onChange({
      ...filters,
      cvss: next,
    });
  };

  return (
    <>
      {/* ----------------- 상단 필터 박스 ----------------- */}
      <Box
        sx={{
          display: "flex",
          border: "1px solid #ccc",
          borderRadius: 1,
          padding: "10px 10px 0 10px",
          marginBottom: 2,
        }}
      >
        {/* CVE / Function Name 검색 */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body2" gutterBottom>
            Search
          </Typography>{" "}
          <TextField
            label="Search CVE or Function Name"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            sx={{ width: 350 }}
          />
        </Box>

        {/* Year 필터 */}
        <Box
          sx={{ display: "flex", flexDirection: "column", margin: "0 20px" }}
        >
          <Typography variant="body2" gutterBottom>
            Year
          </Typography>
          <Box sx={{ marginRight: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={filters.year}
                label="Year"
                onChange={(e) => onChange({ ...filters, year: e.target.value })}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
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
        </Box>

        {/* CVSS 필터 */}
        <Box sx={{ width: 300, margin: "0 20px" }}>
          <Button
            variant="text"
            sx={{
              typography: "body2",
              textTransform: "none",
              padding: 0,
              justifyContent: "center",
              backgroundColor: "rgba(25, 118, 210, 0.3)",
              color: "black",

              "&:focus": {
                outline: "none",
                boxShadow: "none",
              },

              animation: animate
                ? `${jiggleRotateOnce} 800ms cubic-bezier(0.34, 1.56, 0.64, 1)`
                : "none",
            }}
            onClick={() => handleModal()}
          >
            CVSS
          </Button>
          <Box sx={{ mt: 1 }}>
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
                    mr: 1,
                    mb: 1,

                    // 🎨 dynamic language color
                    backgroundColor: isSelected ? color : "transparent",
                    color: isSelected ? "#fff" : "text.primary",

                    border: `1px solid ${color}`,

                    "&:hover": {
                      backgroundColor: isSelected ? color : `${color}22`,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        <BubbleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          data={cveCounts}
          color_pool={CVSS_COLOR_POOL}
        />
      </Box>
    </>
  );
};

export default CveFilters;
