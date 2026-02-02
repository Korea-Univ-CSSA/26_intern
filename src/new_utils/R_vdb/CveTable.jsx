import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  Tooltip,
  Typography,
  Skeleton,
  Chip,
  Box,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import COLOR_POOL from "../color_pool";

const CveTable = ({
  columns,
  data,
  loading,
  order,
  orderBy,
  onSort,
  rowsPerPage,
  paginatedData,
  page,
  onPatchClick,
  getCvssLabel,
}) => {
  return (
    <TableContainer>
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        {/* ================= HEADER ================= */}
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgb(139,53,53)" }}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                sx={{
                  width: `${col.width}px`,
                  minWidth: `${col.width}px`,
                  maxWidth: `${col.width}px`,
                  paddingLeft: `${col.paddingLeft}px`,
                  borderBottom: "1px solid lightgray",
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : "asc"}
                  onClick={() => onSort(col.id)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* ================= BODY ================= */}
        <TableBody>
          {/* ---------- Loading Skeleton ---------- */}
          {loading && data.length === 0 ? (
            Array.from({ length: rowsPerPage }).map((_, rowIdx) => (
              <TableRow key={`skeleton-${rowIdx}`}>
                {columns.map((col) => (
                  <TableCell
                    key={`${col.id}-${rowIdx}`}
                    sx={{
                      width: `${col.width}px`,
                      paddingLeft: `${col.paddingLeft}px`,
                      borderBottom: "1px solid lightgray",
                      textAlign: "center",
                    }}
                  >
                    <Skeleton variant="text" width="80%" height={20} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : paginatedData.length > 0 ? (
            <>
              {/* ---------- Data Rows ---------- */}
              {paginatedData.map((row, idx) => (
                <TableRow key={idx} hover>
                  {columns.map((col) => {
                    let content;

                    if (col.id === "url") {
                      content = (
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<LaunchIcon />}
                          onClick={() => window.open(row[col.id], "_blank")}
                          sx={{
                            color: COLOR_POOL.main[0],
                            borderColor: COLOR_POOL.main[1],
                            "&:hover": {
                              color: "white",
                              backgroundColor: COLOR_POOL.main[0],
                            },
                          }}
                        >
                          Link
                        </Button>
                      );
                    } else if (col.id === "cvss") {
                      const { label, color } = getCvssLabel(row.cvss);
                      content = (
                        <Chip label={label} color={color} size="small" />
                      );
                    } else if (col.id === "patch") {
                      content = (
                        <Button
                          size="small"
                          sx={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: "white",
                            borderColor: COLOR_POOL.main[0],
                            backgroundColor: COLOR_POOL.main[0],
                            "&:hover": {
                              backgroundColor: COLOR_POOL.main[1],
                            },
                          }}
                          onClick={() => onPatchClick(row)}
                        >
                          PATCH
                        </Button>
                      );
                    } else if (col.id === "num") {
                      content = (page - 1) * rowsPerPage + idx + 1;
                    } else {
                      content = row[col.id] ?? "-";
                    }

                    const isTextCell =
                      col.id !== "url" &&
                      col.id !== "cvss" &&
                      col.id !== "patch";

                    return (
                      <TableCell
                        key={col.id}
                        sx={{
                          width: `${col.width}px`,
                          minWidth: `${col.width}px`,
                          maxWidth: `${col.width}px`,
                          borderBottom: "1px solid lightgray",
                          py: 0.5,
                          px: 1.25,
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isTextCell ? (
                          <Tooltip title={String(content)} arrow>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                display: "inline-block",
                                maxWidth: "100%",
                              }}
                            >
                              {content}
                            </Typography>
                          </Tooltip>
                        ) : (
                          content
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

              {/* ---------- Empty Padding Rows ---------- */}
              {Array.from(
                { length: rowsPerPage - paginatedData.length },
                (_, idx) => (
                  <TableRow key={`empty-${idx}`}>
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        sx={{
                          borderBottom: "1px solid lightgray",
                          py: 1,
                          px: 1.25,
                          textAlign: "center",
                          height: 39.75,
                        }}
                      >
                        {"\u00A0"}
                      </TableCell>
                    ))}
                  </TableRow>
                ),
              )}
            </>
          ) : (
            /* ---------- No Data ---------- */
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  py={2}
                >
                  <Typography variant="body2">No Data</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CveTable;
