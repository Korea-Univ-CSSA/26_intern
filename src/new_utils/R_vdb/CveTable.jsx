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
  Paper,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

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
  const renderSkeletonRows = () =>
    Array.from({ length: rowsPerPage }).map((_, i) => (
      <TableRow key={i}>
        {columns.map((col) => (
          <TableCell key={col.id} align="center">
            <Skeleton width="80%" />
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table tableLayout="fixed" width="100%">
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgb(139,53,53)" }}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
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

          <TableBody>
            {loading && data.length === 0
              ? renderSkeletonRows()
              : paginatedData.map((row, idx) => (
                  <TableRow key={idx} hover>
                    {columns.map((col) => {
                      let content;

                      if (col.id === "url") {
                        content = (
                          <Button
                            size="small"
                            endIcon={<LaunchIcon />}
                            href={row[col.id]}
                            target="_blank"
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
                            onClick={() => onPatchClick(row)}
                          >
                            PATCH
                          </Button>
                        );
                      } else {
                        content = row[col.id] ?? "-";
                      }

                      return (
                        <TableCell key={col.id} align="center">
                          <Tooltip title={String(row[col.id] ?? "")} arrow>
                            <Typography noWrap>{content}</Typography>
                          </Tooltip>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CveTable;
