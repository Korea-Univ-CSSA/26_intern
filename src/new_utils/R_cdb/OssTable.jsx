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
  Box,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

const OssTable = ({
  columns,
  data,
  loading,
  order,
  orderBy,
  onSort,
  rowsPerPage,
  page,
  paginatedData,
  onShowVersions,
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
                {col.id !== "github_url" ? (
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : "asc"}
                    onClick={() => onSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
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
                  {columns.map((col) => (
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
                      {col.id === "github_url" ? (
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<LaunchIcon />}
                          onClick={() =>
                            window.open(row.github_url, "_blank")
                          }
                        >
                          Link
                        </Button>
                      ) : col.id === "version" ? (
                        <Button
                          sx={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            width: "100px",
                            color: "rgb(117, 37, 37)",
                          }}
                          onClick={() =>
                            onShowVersions(row.oss_name, row.language)
                          }
                        >
                          Show Versions
                        </Button>
                      ) : col.id === "num" ? (
                        (page - 1) * rowsPerPage + idx + 1
                      ) : (
                        <Tooltip title={row[col.id] || "-"} arrow>
                          <Typography
                            variant="body2"
                            sx={{
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}
                          >
                            {row[col.id] ?? "-"}
                          </Typography>
                        </Tooltip>
                      )}
                    </TableCell>
                  ))}
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
                )
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

export default OssTable;
