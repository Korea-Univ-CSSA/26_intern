import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CweListModal = ({ open, onClose, selectedCwe, pieCweData }) => {
  // ✅ 보여줄 CWE 목록 결정
  const cweList = selectedCwe ? [selectedCwe] : pieCweData;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 5 }}>
        {selectedCwe ? selectedCwe.x2 : "CWE List"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {cweList.map((cwe) => (
          <Box key={cwe.x2} sx={{ mb: 2 }}>
            {!selectedCwe && (
              <Typography fontWeight={600}>
                {cwe.x2} ({cwe.num2})
              </Typography>
            )}

            {/* ✅ CVE 리스트 */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 1,
              }}
            >
              {(cwe.value2 || []).map((cve) => (
                <Box
                  key={cve}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: "rgba(0,0,0,0.05)",
                    fontSize: "0.75rem",
                  }}
                >
                  {cve}
                </Box>
              ))}
            </Box>

            {(!cwe.value2 || cwe.value2.length === 0) && (
              <Typography variant="caption" color="text.secondary">
                No CVE data
              </Typography>
            )}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default CweListModal;
