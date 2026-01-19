import React, { useState, useEffect } from "react";
import { Box, TextField, Chip, Typography, Button } from "@mui/material";
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

const CveFilters = ({ filters, onChange, minStar, maxStar }) => {
  const [animate, setAnimate] = useState(true);
  const [langCounts, setLangCounts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const handleModal = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const functionSet = new Set();
    data.forEach((item) => {
      if (item.functionId) functionSet.add(item.functionId);
    });
    const sortedFunctions = Array.from(functionSet).sort();
    setAvailableFunctions(sortedFunctions);
  }, [data]);

  const getCvssLabel = (score) => {
    const num = parseFloat(score);

    // ✅ 파싱 불가 or 0.0 은 Unknown
    if (isNaN(num) || num <= 0) {
      return { label: "Unknown", color: "default" }; // 회색
    }

    if (num < 4.0) {
      return { label: "Low", color: "success" };
    }

    if (num < 7.0) {
      return { label: "Medium", color: "warning" };
    }

    if (num < 9.0) {
      return { label: "High", color: "error" };
    }

    // ✅ 9.0 이상
    return { label: "Critical", color: "secondary" };
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
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}>
          <Typography variant="h7" gutterBottom>
            Search OSS Name
          </Typography>
          <TextField
            label="Search CVE or Function Name"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 350 }}
          />
        </Box>

        {/* Year 필터 */}
        <Box
          sx={{ display: "flex", flexDirection: "column", margin: "0 20px" }}
        >
          <Typography variant="h7" gutterBottom>
            Year
          </Typography>
          <Box sx={{ marginRight: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
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
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}>
          <Button
            variant="text"
            sx={{
              typography: "body2",
              textTransform: "none",
              padding: 0,
              justifyContent: "flex-start",
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
            Language
          </Button>
          <Box>
            {["Critical", "High", "Medium", "Low", "Unknown"].map((level) => (
              <Chip
                key={level}
                label={level}
                clickable
                variant={selectedSeverities.has(level) ? "filled" : "outlined"}
                color={
                  level === "Critical"
                    ? "secondary" // 보라
                    : level === "High"
                    ? "error" // 빨강
                    : level === "Medium"
                    ? "warning" // 노랑
                    : level === "Low"
                    ? "success" // 초록
                    : "default" // Unknown → 회색
                }
                onClick={() => {
                  const updated = new Set(selectedSeverities);
                  if (updated.has(level)) updated.delete(level);
                  else updated.add(level);
                  setSelectedSeverities(updated);
                }}
                sx={{ mr: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CveFilters;
