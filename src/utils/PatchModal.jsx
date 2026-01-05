// PatchModal.jsx
import React, { useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";

/* =====================
   Diff 렌더링 유틸
===================== */
const renderPatchContent = (content) => {
  if (!content) return "-";

  return content.split("\n").map((line, idx) => {
    let color = "#e0e0e0";

    if (line.startsWith("+++ ") || line.startsWith("--- ")) {
      color = "#64b5f6";
    } else if (line.startsWith("+")) {
      color = "#81c784";
    } else if (line.startsWith("-")) {
      color = "#e57373";
    } else if (line.startsWith("@@")) {
      color = "#ffb74d";
    } else if (line.startsWith("diff --git")) {
      color = "#ba68c8";
    }

    return (
      <Box
        key={idx}
        component="span"
        sx={{
          display: "block",
          color,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {line}
      </Box>
    );
  });
};

/* =====================
   Patch 다운로드
===================== */
const downloadPatch = (content, filename) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const PatchModal = ({
  open,
  onClose,
  patchTarget,
  patchResult,
  patchLoading,
}) => {
  /* =====================
     patch 내용 memoization
  ===================== */
  const renderedPatches = useMemo(() => {
    if (!patchResult || patchResult.length === 0) return null;

    return patchResult.map((item, idx) => (
      <Box
        key={idx}
        sx={{
          mt: 2,
          p: 2,
          border: "1px solid #333",
          borderRadius: 1,
          backgroundColor: "#111",
        }}
      >
        {/* commit description */}
        {item.description && (
          <Typography variant="body2" sx={{ mb: 1, color: "#90caf9" }}>
            {item.description}
          </Typography>
        )}

        {/* patch body (scroll only here) */}
        <Box
          sx={{
            fontFamily:
              'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: "12px",
            lineHeight: 1.5,
            height: "60vh", // ✅ 패치 영역 고정 높이
            overflowY: "auto",
          }}
        >
          {renderPatchContent(item.contents)}
        </Box>
      </Box>
    ));
  }, [patchResult]);

  const getCvssLabel = (score) => {
    const num = parseFloat(score);

    if (isNaN(num) || num <= 0) {
      return { label: "Unknown", color: "default" };
    }
    if (num >= 9.0) {
      return { label: "Critical", color: "secondary" };
    }
    if (num >= 7.0) {
      return { label: "High", color: "error" };
    }
    if (num >= 4.0) {
      return { label: "Medium", color: "warning" };
    }
    return { label: "Low", color: "success" };
  };

  /* 다운로드 대상 (첫 번째 patch) */
  const downloadablePatch =
    patchResult && patchResult.length > 0 ? patchResult[0].contents : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          height: "92vh", // ✅ 모달 자체를 키움
        },
      }}
    >
      <DialogTitle sx={{ fontSize: "3vh" }}>Patch Information</DialogTitle>

      <DialogContent
        dividers={false}
        sx={{
          overflow: "hidden", // ✅ 모달 스크롤 제거
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!patchTarget ? null : (
          <>
            {/* 기본 정보 */}
            <Box sx={{ mb: 1 }}>
              {/* ✅ CVE */}
              <Typography>
                <b>CVE:</b> {patchTarget.cve || patchTarget.cveName}
              </Typography>

              {/* ✅ CWE */}
              {patchTarget.file && (
                <Typography>
                  <b>CWE:</b>{" "}
                  {(patchTarget.file.match(/CWE-\d+/) || ["Unknown"])[0]}
                </Typography>
              )}

              {/* ✅ CVSS (색깔 태그) */}
              {patchTarget.cvss !== undefined && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  <Typography>
                    <b>CVSS:</b>
                  </Typography>

                  {(() => {
                    const { label, color } = getCvssLabel(patchTarget.cvss);
                    return (
                      <Chip
                        label={`${label} (${patchTarget.cvss})`}
                        color={color}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                        }}
                      />
                    );
                  })()}
                </Box>
              )}

              {/* ✅ File (fileName 없을 때만) */}
              {!patchTarget.fileName && patchTarget.file && (
                <Typography sx={{ mt: 0.5 }}>
                  <b>File:</b> {patchTarget.file}
                </Typography>
              )}
            </Box>

            {/* Patch 영역 */}
            {patchLoading ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgress size={56} thickness={4} />
                  <Typography>Loading patch data…</Typography>
                </Box>
              </Box>
            ) : patchResult.length === 0 ? (
              <Typography sx={{ color: "gray" }}>
                No patch information found.
              </Typography>
            ) : (
              renderedPatches
            )}
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between", // ✅ 좌측: 다운로드 / 우측: Close
        }}
      >
        <Button
          disabled={!downloadablePatch}
          onClick={() =>
            downloadPatch(
              downloadablePatch,
              `${patchTarget?.cve || "patch"}.patch`
            )
          }
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgb(70, 130, 180)", // steelblue
            color: "#fff",
            px: 2.5,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgb(60, 120, 170)",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgb(180, 180, 180)",
              color: "#eee",
            },
          }}
        >
          Download Patch
        </Button>

        <Button
          onClick={onClose}
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgb(120, 120, 120)",
            color: "#fff",
            px: 2.5,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgb(100, 100, 100)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatchModal;
