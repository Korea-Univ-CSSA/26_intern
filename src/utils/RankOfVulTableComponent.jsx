import React, { useState, useMemo } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ROWS_PER_PAGE = 3;
const PAGE_BUTTON_NUM = 4;

const EMPTY_ROW = {
  rank: null,
  name: null,
  count: null,
};

const RankOfVulTableComponent = ({ response }) => {
  // ✅ raw data
  const rawData = response?.raw_data ?? [];

  // ✅ file 기준 count → count 내림차순 → rank 부여
  const realData = useMemo(() => {
    const fileCountMap = rawData.reduce((acc, { file }) => {
      if (!file) return acc;
      acc[file] = (acc[file] || 0) + 1;
      return acc;
    }, {});

    const sorted = Object.entries(fileCountMap)
      .map(([file, count]) => ({ file, count }))
      .sort((a, b) => b.count - a.count);

    return sorted.map((item, idx) => ({
      rank: idx + 1,
      name: item.file,
      count: item.count,
    }));
  }, [rawData]);

  // ✅ 상태
  const [page, setPage] = useState(0);
  const [pageGroup, setPageGroup] = useState(0);

  // ✅ pagination 계산
  const totalPages = Math.max(1, Math.ceil(realData.length / ROWS_PER_PAGE));

  const pagedData = realData.slice(
    page * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE + ROWS_PER_PAGE
  );

  const displayData = [
    ...pagedData,
    ...Array(Math.max(0, ROWS_PER_PAGE - pagedData.length)).fill(EMPTY_ROW),
  ];

  // ✅ 페이지 이동
  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      setPageGroup(Math.floor(newPage / PAGE_BUTTON_NUM));
    }
  };

  const handleNextGroup = () => {
    const nextGroup = pageGroup + 1;
    if (nextGroup * PAGE_BUTTON_NUM < totalPages) {
      setPageGroup(nextGroup);
      setPage(nextGroup * PAGE_BUTTON_NUM);
    }
  };

  const handlePrevGroup = () => {
    if (pageGroup > 0) {
      const prevGroup = pageGroup - 1;
      setPageGroup(prevGroup);
      setPage(prevGroup * PAGE_BUTTON_NUM);
    }
  };

  // ✅ 페이지 버튼
  const renderPageButtons = () => {
    const start = pageGroup * PAGE_BUTTON_NUM;
    const end = Math.min(totalPages, start + PAGE_BUTTON_NUM);

    return Array.from({ length: end - start }, (_, idx) => {
      const pageIndex = start + idx;
      const isActive = pageIndex === page;

      return (
        <Button
          key={pageIndex}
          variant="contained"
          onClick={() => handleChangePage(pageIndex)}
          sx={{
            minWidth: "40px",
            backgroundColor: isActive ? "rgb(134, 32, 32)" : "rgb(194, 62, 62)",
            color: isActive ? "white" : "black",
            "&:hover": { opacity: 0.85 },
          }}
        >
          {pageIndex + 1}
        </Button>
      );
    });
  };

  return (
    <Box sx={{ width: "100%", height: "500px" }}>
      {/* ✅ 상단 요약 */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#782333",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "10px",
        }}
      >
        <Typography color="lightgray">
          #Detected vulnerable code clones
        </Typography>
        <Typography variant="h4" color="white">
          {rawData.length}
        </Typography>
      </Box>

      {/* ✅ Table */}
      <Box
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          overflow: "hidden",
          height: "72%",
        }}
      >
        <TableContainer sx={{ minHeight: 300, maxHeight: 300 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{
                    backgroundColor: "#782333",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Rank of Vulnerable Files
                </TableCell>
              </TableRow>

              <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Rank
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Count
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayData.map((file, idx) => (
                <TableRow key={idx} sx={{ height: 56 }}>
                  <TableCell align="center">{file.rank ?? ""}</TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      cursor: file.name ? "pointer" : "default",
                    }}
                  >
                    <Tooltip title={file.name ?? ""}>
                      <span>{file.name ?? ""}</span>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center">{file.count ?? ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <IconButton onClick={handlePrevGroup} disabled={pageGroup === 0}>
            <ArrowBackIosNewIcon />
          </IconButton>

          <Box display="flex" gap={0.5}>
            {renderPageButtons()}
          </Box>

          <IconButton
            onClick={handleNextGroup}
            disabled={(pageGroup + 1) * PAGE_BUTTON_NUM >= totalPages}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default RankOfVulTableComponent;
