import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Tooltip,
  Chip,
  Box,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import COLOR_POOL from "../color_pool";

const LANGUAGE_LIST = ["C/C++", "Java", "Python", "Go", "PHP"];

const getLanguageColor = (language) => {
  const index = LANGUAGE_LIST.indexOf(language);
  return COLOR_POOL.lan_bg[index % COLOR_POOL.lan_bg.length];
};

// -------- helper: split "author/project" --------
const splitOssName = (fullName = "") => {
  if (!fullName.includes("/")) {
    return { author: "unknown", oss_name: fullName };
  }
  const [author, oss_name] = fullName.split("/");
  return { author, oss_name };
};

export default function OssCard({ data = {}, index, onShowVersions }) {
  const {
    oss_name: rawOssName,
    language,
    github_stars,
    detected_counts,
    github_url,
    modifiedDate,
  } = data;

  const { oss_name, author } = splitOssName(rawOssName);

  return (
    <Card
      sx={{
        maxWidth: 280,
        height: "100%",
        transition: "0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
      variant="outlined"
    >
      {/* ---------- Header (Language badge + date) ---------- */}
      <CardContent sx={{ px: 1.25, py: 1, pb: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label={language || "??"}
            size="small"
            sx={{
              height: 20,
              fontSize: "11px",
              backgroundColor: language
                ? getLanguageColor(language)
                : "grey.300",
              color: "#000",
            }}
          />

          <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
            {modifiedDate || "—"}
          </Typography>
        </Box>
      </CardContent>

      {/* ---------- Main Content ---------- */}
      <CardContent sx={{ px: 1.25, py: 0.75 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* -------- Name + Author (LEFT, ellipsis) -------- */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0, // REQUIRED for ellipsis in flex
            }}
          >
            <Tooltip title={`${oss_name || "-"} / ${author || "-"}`} arrow>
              <Box>
                {/* ---- Line 1: OSS name ---- */}
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {oss_name || "........"}
                </Typography>

                {/* ---- Line 2: Author ---- */}
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 400,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {author || "unknown"}
                </Typography>
              </Box>
            </Tooltip>
          </Box>

          {/* -------- Stats (RIGHT, fixed) -------- */}
          <Box
            sx={{
              display: "flex",
              gap: 1.25,
              flexShrink: 0, // NEVER wrap
            }}
          >
            <Typography sx={{ fontSize: "11px", whiteSpace: "nowrap" }}>
              ⭐ {github_stars ?? "—"}
            </Typography>
            <Typography sx={{ fontSize: "11px", whiteSpace: "nowrap" }}>
              🔍 {detected_counts ?? "—"}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* ---------- Actions ---------- */}
      <CardActions
        sx={{
          px: 1.25,
          py: 0.75,
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          size="small"
          sx={{
            fontSize: "11px",
            textTransform: "none",
            minHeight: 24,
            px: 1,
          }}
          onClick={() => onShowVersions(oss_name, language)}
        >
          Versions
        </Button>

        <Button
          size="small"
          component="a"
          href={github_url}
          target="_blank"
          rel="noopener noreferrer"
          disabled={!github_url}
          endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
          sx={{
            fontSize: "11px",
            textTransform: "none",
            minHeight: 24,
            px: 1,
          }}
        >
          GitHub
        </Button>
      </CardActions>
    </Card>
  );
}
