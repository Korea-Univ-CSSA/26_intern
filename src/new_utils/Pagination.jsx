import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";

const Pagination = ({
  page,
  totalPages,
  onChangePage,

  // optional / configurable
  pageWindow = 10,
  step = 10,
  showJump = true,
}) => {
  const [jumpPage, setJumpPage] = useState("");
  const pageGroup = Math.floor((page - 1) / pageWindow);

  const handlePageChange = (newPage) => {
    setJumpPage("");
    onChangePage(newPage);
  };

  // ---- debounce jump-to-page ----
  useEffect(() => {
    if (!jumpPage) return;

    const timer = setTimeout(() => {
      const target = Number(jumpPage);
      if (
        Number.isInteger(target) &&
        target >= 1 &&
        target <= totalPages &&
        target !== page
      ) {
        onChangePage(target);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [jumpPage, totalPages, page, onChangePage]);

  // ---- page number buttons ----
  const renderPageButtons = () => {
    const start = pageGroup * pageWindow + 1;
    const end = Math.min(totalPages, start + pageWindow - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
      (i) => (
        <Button
          key={i}
          variant="contained"
          onClick={() => onChangePage(i)}
          sx={{
            width: 40,
            minWidth: 40,
            backgroundColor: i === page ? "rgb(134,32,32)" : "rgb(194,62,62)",
            color: i === page ? "white" : "black",
            "&:hover": {
              backgroundColor: i === page ? "rgb(134,32,32)" : "rgb(194,62,62)",
              opacity: 0.85,
            },
          }}
        >
          {i}
        </Button>
      ),
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 0",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      {/* First / Prev */}
      <Box>
        <IconButton onClick={() => handlePageChange(1)} disabled={page === 1}>
          {"<<"}
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(page - step)}
          disabled={page <= step}
        >
          {"<"}
        </IconButton>
      </Box>

      {/* Page numbers */}
      <Box sx={{ display: "flex", gap: "5px" }}>
        {renderPageButtons().map((btn) =>
          React.cloneElement(btn, {
            onClick: () => handlePageChange(Number(btn.key)),
          }),
        )}
      </Box>

      {/* Next / Last */}
      <Box>
        <IconButton
          onClick={() => handlePageChange(page + step)}
          disabled={page + step > totalPages}
        >
          {">"}
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
        >
          {">>"}
        </IconButton>
      </Box>

      {/* Jump to page */}
      {showJump && (
        <TextField
          size="small"
          value={jumpPage}
          placeholder="Jump to.."
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const target = Number(jumpPage);
              if (
                Number.isInteger(target) &&
                target >= 1 &&
                target <= totalPages
              ) {
                onChangePage(target);
              }
            }
          }}
          sx={{ width: 120 }}
          slotProps={{
            htmlInput: {
              inputMode: "numeric",
              pattern: "[0-9]*",
            },
          }}
        />
      )}
    </Box>
  );
};

export default Pagination;
