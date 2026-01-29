import { useState, useEffect, useRef } from "react";
import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function CardSortUI({ columns = [], sortKey, sortOrder, onChange }) {
  const buttonRefs = useRef([]);
  const [maxWidth, setMaxWidth] = useState(0);

  // Measure widest button after first render
  useEffect(() => {
    if (buttonRefs.current.length > 0) {
      const widths = buttonRefs.current.map((btn) => btn?.offsetWidth || 0);
      setMaxWidth(Math.max(...widths));
    }
  }, [columns]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {/* ---------- Sort Key Selector ---------- */}
      <ToggleButtonGroup
        value={sortKey}
        exclusive
        size="small"
        onChange={(_, newKey) => {
          if (newKey) onChange(newKey, sortOrder);
        }}
      >
        {columns.map((col, i) => (
          <ToggleButton
            key={col.key}
            value={col.key}
            ref={(el) => (buttonRefs.current[i] = el)}
            sx={{
              minWidth: maxWidth, 
              textTransform: "none",
            }}
          >
            {col.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* ---------- Sort Order Toggle ---------- */}
      <Button
        size="small"
        variant="outlined"
        minWidth= {maxWidth}
        onClick={() => onChange(sortKey, sortOrder === "asc" ? "desc" : "asc")}
      >
        {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
      </Button>
    </Box>
  );
}
