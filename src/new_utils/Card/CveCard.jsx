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

const getCVSSColor = (label) => {
  const index = CVSS_LIST.indexOf(label);
  return COLOR_POOL.cvss_bg[index % COLOR_POOL.cvss_bg.length];
};

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

  // ✅ derive cvss label safely
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
      {/* ---------- Header ---------- */}
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
            {modifiedDate || "—"}
          </Typography>
        </Box>
      </CardContent>
      {/* ---------- Main ---------- */}
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
            {fun_name || "unknown"}
          </Typography>
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
          sx={{ fontSize: "11px", textTransform: "none", minHeight: 24 }}
          onClick={() => onPatchClick(cve_name, cvss_num)}
        >
          Patch
        </Button>

        <Button
          size="small"
          component="a"
          href={cve_url}
          target="_blank"
          rel="noopener noreferrer"
          disabled={!cve_url}
          endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
          sx={{ fontSize: "11px", textTransform: "none", minHeight: 24 }}
        >
          Link
        </Button>
      </CardActions>
    </Card>
  );
}
