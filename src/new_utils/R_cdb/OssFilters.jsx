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
import COLOR_POOL from "../color_pool";

const jiggleRotateOnce = keyframes`
  0% { transform: translate(0,0) rotate(0deg); }
  25% { transform: translate(-2px, -2px) rotate(-2deg); }
  50% { transform: translate(2px, 2px) rotate(2deg); }
  75% { transform: translate(-1px, 1px) rotate(-1deg); }
  100% { transform: translate(0,0) rotate(0deg); }
`;

const LANGUAGE_LIST = ["C/C++", "Java", "Python", "Go", "PHP"];

// -------- helper: get "corresponding color --------
const getLanguageColor = (language) => {
  const idx = LANGUAGE_LIST.indexOf(language);
  return COLOR_POOL.language[idx % COLOR_POOL.language.length];
};

// -------- shared card style  --------
const filterCard = {
  border: "1px solid #e0e0e0",
  borderRadius: 2,
  padding: 1.5,
  backgroundColor: "#fafafa",
};

// -------- range slider style  --------
const sliderSx = {
  height: 22,
  "& .MuiSlider-rail": {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#bdbdbd",
    opacity: 1,
  },
  "& .MuiSlider-track": {
    height: 12,
    borderRadius: 999,
    backgroundColor: COLOR_POOL.main[0],
    border: "none",
    top: "50%",
    transform: "translateY(-50%)",
  },
  "& .MuiSlider-thumb": {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    border: "3px solid #bdbdbd",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
};

const inputStyle = {
  fontSize: 12,
  padding: "4px 6px",
  textAlign: "center",
};

// -------- Start of the OssFilters component --------

const OssFilters = ({
  filters,
  onChange,
  minStar,
  maxStar,
  minDetect,
  maxDetect,
}) => {
  const [animate, setAnimate] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [langCounts, setLangCounts] = useState({});

  {
    /* ---------- Temp buffer for stars ---------- */
  }
  const [draftStars, setDraftStars] = useState([
    String(filters.stars[0]),
    String(filters.stars[1]),
  ]);

  useEffect(() => {
    setDraftStars([String(filters.stars[0]), String(filters.stars[1])]);
  }, [filters.stars]);

  {
    /* ---------- Temp buffer for detected ---------- */
  }
  const [draftDetected, setDraftDetected] = useState([
    String(filters.detected[0]),
    String(filters.detected[1]),
  ]);

  useEffect(() => {
    setDraftDetected([
      String(filters.detected[0]),
      String(filters.detected[1]),
    ]);
  }, [filters.detected]);

  {
    /* ----------------- Buffer to SetDraft ----------------- */
  }
  const commitRange = (key, draft, setDraft, min, max, index) => {
    let a = Number(draft[0]);
    let b = Number(draft[1]);
    if (Number.isNaN(a)) a = filters[key][0];
    if (Number.isNaN(b)) b = filters[key][1];

    a = Math.max(min, Math.min(a, max));
    b = Math.max(min, Math.min(b, max));

    if (a > b) {
      if (index === 0) b = a;
      else a = b;
    }

    onChange({ ...filters, [key]: [a, b] });
    setDraft([String(a), String(b)]);
  };

  {
    /* ---------- API call for OSS Bubble Chart ---------- */
  }
  useEffect(() => {
    const fetchLangCounts = async () => {
      try {
        const res = await customAxios.get("/api/search/cdb/all");

        const counts = {};
        LANGUAGE_LIST.forEach((l) => (counts[l] = 0));

        res.data.forEach((item) => {
          const uiLang =
            item.lang === "C"
              ? "C/C++"
              : item.lang === "java"
                ? "Java"
                : item.lang === "python"
                  ? "Python"
                  : item.lang === "go"
                    ? "Go"
                    : item.lang === "php"
                      ? "PHP"
                      : null;

          if (uiLang) counts[uiLang] += 1;
        });

        setLangCounts(counts);
      } catch (err) {
        console.error("Failed to fetch language counts:", err);
      }
    };

    fetchLangCounts();
  }, []);

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
            md: "1.2fr 0.8fr 1fr 1fr",
          },
        }}
      >
        {/* ----------------- Search ----------------- */}
        <Box sx={filterCard}>
          <Typography variant="body2" gutterBottom>
            Search
          </Typography>
          <TextField
            size="small"
            label="OSS Name"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            fullWidth
          />
        </Box>

        {/* ----------------- Language ----------------- */}
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
            Language
          </Button>

          <Box>
            {LANGUAGE_LIST.map((lang) => {
              const selected = filters.languages.includes(lang);
              const color = getLanguageColor(lang);
              return (
                <Chip
                  key={lang}
                  label={lang}
                  clickable
                  onClick={() =>
                    onChange({
                      ...filters,
                      languages: selected
                        ? filters.languages.filter((l) => l !== lang)
                        : [...filters.languages, lang],
                    })
                  }
                  sx={{
                    mr: 0.5,
                    mb: 0.5,
                    border: `1px solid ${color}`,
                    backgroundColor: selected ? color : "transparent",
                    color: selected ? "#fff" : "text.primary",
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* ----------------- Github Stars ----------------- */}
        <Box sx={filterCard}>
          <Typography variant="body2" mb={1}>
            GitHub Stars
          </Typography>

          <Box sx={{ display: "flex", gap: 0.75, mb: 1 }}>
            <TextField
              size="small"
              value={draftStars[0]}
              onChange={(e) => setDraftStars([e.target.value, draftStars[1]])}
              onBlur={() =>
                commitRange(
                  "stars",
                  draftStars,
                  setDraftStars,
                  minStar,
                  maxStar,
                  0,
                )
              }
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
              }}
              sx={{ width: 70 }}
            />
            <Typography>~</Typography>
            <TextField
              size="small"
              value={draftStars[1]}
              onChange={(e) => setDraftStars([draftStars[0], e.target.value])}
              onBlur={() =>
                commitRange(
                  "stars",
                  draftStars,
                  setDraftStars,
                  minStar,
                  maxStar,
                  1,
                )
              }
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
              }}
              sx={{ width: 72 }}
            />
          </Box>

          <Slider
            value={filters.stars}
            onChange={(_, v) => onChange({ ...filters, stars: v })}
            min={minStar}
            max={maxStar}
            disableSwap
            valueLabelDisplay="auto"
            sx={sliderSx}
          />
        </Box>

        {/* ----------------- Detected ----------------- */}
        <Box sx={filterCard}>
          <Typography variant="body2" mb={1}>
            Detected
          </Typography>

          <Box sx={{ display: "flex", gap: 0.75, mb: 1 }}>
            <TextField
              size="small"
              value={draftDetected[0]}
              onChange={(e) =>
                setDraftDetected([e.target.value, draftDetected[1]])
              }
              onBlur={() =>
                commitRange(
                  "detected",
                  draftDetected,
                  setDraftDetected,
                  minDetect,
                  maxDetect,
                  0,
                )
              }
              inputProps={{ inputMode: "numeric", style: inputStyle }}
              sx={{ width: 72 }}
            />
            <Typography>~</Typography>
            <TextField
              size="small"
              value={draftDetected[1]}
              onChange={(e) =>
                setDraftDetected([draftDetected[0], e.target.value])
              }
              onBlur={() =>
                commitRange(
                  "detected",
                  draftDetected,
                  setDraftDetected,
                  minDetect,
                  maxDetect,
                  1,
                )
              }
              inputProps={{ inputMode: "numeric", style: inputStyle }}
              sx={{ width: 72 }}
            />
          </Box>

          <Slider
            value={filters.detected}
            onChange={(_, v) => onChange({ ...filters, detected: v })}
            min={minDetect}
            max={maxDetect}
            disableSwap
            valueLabelDisplay="auto"
            sx={sliderSx}
          />
        </Box>

        {/* ----------------- Bubble Modal ----------------- */}
        <BubbleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          data={langCounts}
          color_pool={COLOR_POOL.language}
        />
      </Box>
    </>
  );
};

export default OssFilters;
