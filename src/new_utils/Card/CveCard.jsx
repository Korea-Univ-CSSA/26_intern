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

const CVSS_LIST = ["Critical", "High", "Medium", "Low", "Unknown"];

// -------- helper: get "corresponding color --------
const getCVSSColor = (label) => {
  const index = CVSS_LIST.indexOf(label);
  return COLOR_POOL.cvss_bg[index % COLOR_POOL.cvss_bg.length];
};

// -------- helper: match Label based on CVSS number --------
const getCvssLabel = (cvss_num) => {
  const num = parseFloat(cvss_num);

  if (isNaN(num) || num <= 0) {
    return { label: "Unknown", color: "default" };
  }
  if (num < 4) return { label: "Low", color: "success" };
  if (num < 7) return { label: "Medium", color: "warning" };
  if (num < 9) return { label: "High", color: "error" };
  return { label: "Critical", color: "secondary" };
};

export default function CveCard({ data = {}, index, onPatchClick }) {
  const normalized = {
    cve_name: data.cve_name ?? data.cveName,
    cvss_num: data.cvss_num ?? data.cvss,
    fun_name: data.fun_name ?? data.functionId,
    cve_url: data.cve_url ?? data.url,
    modifiedDate: data.modifiedDate ?? null,
  };

  const { cve_name, cvss_num, fun_name, cve_url, modifiedDate } = normalized;

  // derive cvss label safely
  const { label: cvssLabel } = getCvssLabel(cvss_num);

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
      {/* ---------- Header (Cvss badge + Cvss Number) ---------- */}
      <CardContent sx={{ px: 1.25, py: 1, pb: 0.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Chip
            label={cvssLabel}
            size="small"
            sx={{
              height: 20,
              fontSize: "11px",
              backgroundColor: getCVSSColor(cvssLabel),
              color: "#000",
            }}
          />

          <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
            {cvss_num || "—"}
          </Typography>
        </Box>
      </CardContent>

      {/* ---------- Main Content ---------- */}
      <CardContent sx={{ px: 1.25, py: 0.75 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          {/* ---- Line 1: CVE name ---- */}
          <Tooltip title={cve_name || "-"} arrow>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {cve_name || "—"}
            </Typography>
          </Tooltip>

          {/* ---- Line 2: Function ---- */}
          <Tooltip title={fun_name || "unknown"} arrow>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 400,
                color: "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "default",
              }}
            >
              Function: {fun_name || "unknown"}
            </Typography>
          </Tooltip>
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
        {/* ---------- Show Patch ---------- */}
        <Button
          size="small"
          sx={{
            fontSize: "11px",
            textTransform: "none",
            minHeight: 24,
            color: "white",
            borderColor: COLOR_POOL.main[0],
            backgroundColor: COLOR_POOL.main[0],
            "&:hover": {
              backgroundColor: COLOR_POOL.main[1],
            },
          }}
          onClick={() => onPatchClick(data)}
        >
          Patch
        </Button>

        {/* ---------- CVE Link ---------- */}
        <Button
          size="small"
          component="a"
          href={cve_url}
          target="_blank"
          rel="noopener noreferrer"
          disabled={!cve_url}
          endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
          sx={{
            fontSize: "11px",
            textTransform: "none",
            minHeight: 24,
            color: "white",
            borderColor: COLOR_POOL.main[0],
            backgroundColor: COLOR_POOL.main[0],
            "&:hover": {
              color: "white",
              backgroundColor: COLOR_POOL.main[1],
            },
          }}
        >
          Link
        </Button>
      </CardActions>
    </Card>
  );
}
