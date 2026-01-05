import React, { useState, useEffect } from "react";
import { Box, TextField, Chip, Slider, Typography } from "@mui/material";

const OssTableFilters = ({
  data,
  searchQuery,
  setSearchQuery,
  setFilteredData,
  setPage,
  setPageGroup,
  setOssAllCount,
}) => {
  const [languageFilter, setLanguageFilter] = useState(new Set());
  const [starRange, setStarRange] = useState([0, 999999]);
  const [minStar, setMinStar] = useState(0);
  const [maxStar, setMaxStar] = useState(0);

  useEffect(() => {
    if (data.length > 0) {
      const stars = data.map((d) => d.github_stars ?? 0);
      const min = Math.min(...stars);
      const max = Math.max(...stars);
      setMinStar(min);
      setMaxStar(max);
      setStarRange([min, max]);
    }
  }, [data]);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = data.filter((item) => {
      const oss = item.oss_name?.toLowerCase() ?? "";
      const version = item.version?.toLowerCase() ?? "";
      const lang = item.language?.toLowerCase() ?? "";
      const stars = item.github_stars ?? 0;

      const langMatch =
        languageFilter.size === 0 || languageFilter.has(item.language);

      const starMatch = stars >= starRange[0] && stars <= starRange[1];

      // 부분 검색은 유지
      return (
        (oss.includes(query) ||
          version.includes(query) ||
          lang.includes(query)) &&
        langMatch &&
        starMatch
      );
    });

    setFilteredData(result);
    setPage(1);
    setPageGroup(0);
    setOssAllCount(result.length);
  }, [searchQuery, data, languageFilter, starRange]);

  const toggleLanguage = (lang) => {
    const updated = new Set(languageFilter);
    if (updated.has(lang)) updated.delete(lang);
    else updated.add(lang);
    setLanguageFilter(updated);
  };

  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid #ccc",
        borderRadius: 1,
        padding: "10px 10px 0 10px",
        marginBottom: 2,
      }}
    >
      {/* Search */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body2" gutterBottom>
          Search OSS Name
        </Typography>
        <TextField
          label="OSS Name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300, height: 100 }}
        />
      </Box>

      {/* Language */}
      <Box sx={{ width: 300, margin: "0 20px" }}>
        <Typography variant="body2" gutterBottom>
          Language
        </Typography>
        <Box
          sx={{
            marginBottom: 2,
            border: "1px solid #ccc",
            padding: 1,
            borderRadius: 1,
            height: 100,
          }}
        >
          {["C/C++", "Java", "Python", "Go", "PHP"].map((lang) => {
            const colorMap = {
              "C/C++": "primary",
              Java: "secondary",
              Python: "success",
              Go: "warning",
              PHP: "info",
            };

            return (
              <Chip
                key={lang}
                label={lang}
                clickable
                variant={languageFilter.has(lang) ? "filled" : "outlined"}
                color={colorMap[lang]}
                onClick={() => toggleLanguage(lang)}
              />
            );
          })}
        </Box>
      </Box>

      {/* Stars */}
      <Box sx={{ width: 300, marginBottom: 2 }}>
        <Typography variant="body2" gutterBottom>
          GitHub Stars : {starRange[0]} ~ {starRange[1]}
        </Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            padding: 3,
            borderRadius: 1,
            height: 100,
          }}
        >
          <Slider
            value={starRange}
            onChange={(_, newVal) => setStarRange(newVal)}
            valueLabelDisplay="auto"
            min={minStar}
            max={maxStar}
            step={1}
            marks={Array.from(
              { length: Math.floor((maxStar - minStar) / 50000) + 1 },
              (_, i) => {
                const value = minStar + i * 50000;
                return {
                  value,
                  label: `${value >= 1000 ? value / 1000 + "k" : value}`,
                };
              }
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default OssTableFilters;
