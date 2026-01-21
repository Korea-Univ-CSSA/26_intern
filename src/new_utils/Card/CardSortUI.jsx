import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function CardSortUI({
  columns = [],
  sortKey,
  sortOrder,
  onChange,
}) {
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
      <ToggleButtonGroup
        value={sortKey}
        exclusive
        size="small"
        onChange={(_, newKey) => {
          if (newKey) {
            onChange(newKey, sortOrder);
          }
        }}
      >
        {columns.map((col) => (
          <ToggleButton key={col.key} value={col.key}>
            {col.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          onChange(sortKey, sortOrder === "asc" ? "desc" : "asc")
        }
      >
        {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
      </Button>
    </Box>
  );
}
