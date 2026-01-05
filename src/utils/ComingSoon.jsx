import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import { useNavigate } from "react-router-dom";

export const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <ConstructionIcon sx={{ fontSize: 80, color: "#fbbf24", mb: 2 }} />

      <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
        Not Available Page!
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          backgroundColor: "rgb(126, 34, 34)",
        }}
      >
        Back
      </Button>
    </Box>
  );
};

export default ComingSoon;
