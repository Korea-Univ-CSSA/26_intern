import React from "react";
import { Box, TextField, Chip, Slider, Typography } from "@mui/material";

const LANGUAGE_LIST = ["C/C++", "Java", "Python", "Go", "PHP"];

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

const getLanguageColor = (language, allLanguages) => {
  const index = allLanguages.indexOf(language);
  return LANGUAGE_COLOR_POOL[index % LANGUAGE_COLOR_POOL.length];
};

const OssFilters = ({ filters, onChange, minStar, maxStar }) => {
  const toggleLanguage = (lang) => {
    const next = filters.languages.includes(lang)
      ? filters.languages.filter((l) => l !== lang)
      : [...filters.languages, lang];

    onChange({ ...filters, languages: next });
  };

  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid #ccc",
        borderRadius: 1,
        padding: 2,
        marginBottom: 2,
      }}
    >
      {/* Search */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body2" gutterBottom>
          Search
        </Typography>{" "}
        <TextField
          label="OSS Name"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          sx={{ width: 300, height: 100 }}
        />
      </Box>

      {/* Language */}
      <Box sx={{ width: 300, margin: "0 20px" }}>
        <Typography variant="body2" gutterBottom>
          Language
        </Typography>

        <Box sx={{ mt: 1 }}>
          {LANGUAGE_LIST.map((lang) => {
            const isSelected = filters.languages.includes(lang);
            const color = getLanguageColor(lang, LANGUAGE_LIST);

            return (
              <Chip
                key={lang}
                label={lang}
                clickable
                onClick={() => toggleLanguage(lang)}
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

      {/* Stars */}
      <Box sx={{ width: 300, marginBottom: 2 }}>
        <Typography variant="body2" gutterBottom>
          GitHub Stars : {filters.stars[0]} ~ {filters.stars[1]}
        </Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            padding: 3,
            borderRadius: 1,
            height: 100,
          }}
        >
          {minStar < maxStar && (
            <Slider
              value={filters.stars}
              valueLabelDisplay="auto"
              min={minStar}
              max={maxStar}
              step={1}
              onChange={(_, v) => onChange({ ...filters, stars: v })}
              marks={Array.from({ length: 6 }, (_, i) => {
                const value = minStar + ((maxStar - minStar) / 5) * i;
                return {
                  value: Math.round(value),
                  label: value >= 1000 ? `${Math.round(value / 1000)}k` : value,
                };
              })}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OssFilters;
