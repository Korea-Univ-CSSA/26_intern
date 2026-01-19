// BubbleModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import BubbleChart from "./BubbleChart";
import DATASETS from "./testData"


const BubbleModal = ({ open, onClose, data, color_pool }) => {
  if (!data) return null;

  const chartW = 900; // make it bigger than dialog so scroll appears
  const chartH = 700;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>Packed Bubble Chart</DialogTitle>

      <DialogContent
        sx={{
          height: "75vh",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: 900, height: 700, flexShrink: 0 }}>
          <BubbleChart
            //DATASETS.cvss
            data={data}
            colors={color_pool}
            width={1200}
            height={900}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BubbleModal;
