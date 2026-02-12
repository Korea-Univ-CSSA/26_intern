import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import COLOR_POOL from "./color_pool";

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
  const hasPagination = totalPages > 1;

  useEffect(() => {
    setJumpPage("");
  }, [page]);

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
    }, 900);

    return () => clearTimeout(timer);
  }, [jumpPage, totalPages, page, onChangePage]);

  // ---- render page number buttons ----
  const renderPageButtons = () => {
    if (totalPages < 1) return null;

    const start = pageGroup * pageWindow + 1;
    const end = Math.min(totalPages, start + pageWindow - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
      (i) => (
        <Button
          key={i}
          variant="contained"
          onClick={() => handlePageChange(i)}
          sx={{
            width: 40,
            minWidth: 40,
            backgroundColor:
              i === page ? COLOR_POOL.main[1] : COLOR_POOL.main[0],
            color: i === page ? "white" : "black",
            "&:hover": {
              backgroundColor:
                i === page ? COLOR_POOL.main[1] : COLOR_POOL.main[0],
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
        flexWrap: "nowrap",
      }}
    >
      {/* Left: Jump + First / Prev */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          marginLeft: 2,
        }}
      >
        {showJump && (
          <TextField
            size="small"
            value={jumpPage}
            placeholder="Page #"
            disabled={!hasPagination}
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
            sx={{ width: 100 }}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
            }}
          />
        )}

        <IconButton
          onClick={() => handlePageChange(1)}
          disabled={!hasPagination || page === 1}
        >
          {"<<"}
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(page - step)}
          disabled={!hasPagination || page <= step}
        >
          {"<"}
        </IconButton>
      </Box>

      {/* Center: Page numbers (FIXED WIDTH – NO RESIZE) */}
      <Box
        sx={{
          display: "flex",
          gap: "5px",
          width: pageWindow * 40 + (pageWindow - 1) * 5,
          justifyContent: "center",
        }}
      >
        {renderPageButtons()}
      </Box>

      {/* Right: Next / Last (space preserved) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
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

      {/* Page indicator (always visible, anchors layout) */}
      <Box
        sx={{
          fontSize: 12,
          color: "text.secondary",
          whiteSpace: "nowrap",
          marginRight: 2,
        }}
      >
        Page {page} of {totalPages}
      </Box>
    </Box>
  );
};

export default Pagination;
