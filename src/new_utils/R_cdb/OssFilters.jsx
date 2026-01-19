import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Chip,
  Slider,
  Typography,
  Button,
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

const LANGUAGE_LIST = ["C/C++", "Java", "Python", "Go", "PHP"];
const LANG_MAP = {
  "C/C++": "C",
  Java: "java",
  Python: "python",
  Go: "go",
  PHP: "php",
};

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
    const fetchLangCounts = async () => {
      try {
        const res = await customAxios.get("/api/search/cdb/all");

        //console.log("First 30 API entries:", res.data.slice(0, 30));

        // Initialize counts for UI labels
        const counts = {};
        LANGUAGE_LIST.forEach((lang) => (counts[lang] = 0));

        // Count by database keys
        res.data.forEach((item) => {
          // Find the UI label corresponding to the DB key
          const uiLang = Object.keys(LANG_MAP).find(
            (key) => LANG_MAP[key] === item.lang,
          );

          if (uiLang) {
            counts[uiLang] += 1;
          }
        });

        setLangCounts(counts);
      } catch (err) {
        console.error("Failed to fetch language counts:", err);
      }
    };

    fetchLangCounts();
  }, []);

  const toggleLanguage = (lang) => {
    const next = filters.languages.includes(lang)
      ? filters.languages.filter((l) => l !== lang)
      : [...filters.languages, lang];

    onChange({ ...filters, languages: next });
  };

  //console.log(langCounts);

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

      <BubbleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={langCounts}
        color_pool={LANGUAGE_COLOR_POOL}
      />
    </Box>
  );
};

export default OssFilters;
