import React, { useState, useEffect, useRef } from "react";
import { customAxios } from "../../utils/CustomAxios";
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
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import VersionModal from "./VersionModal";
import PatchModal from "../../utils/PatchModal";

const CveTable = ({
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
  const renderSkeletonRows = (rowCount, columns) =>
    Array.from({ length: rowCount }).map((_, rowIdx) => (
      <TableRow key={`skeleton-row-${rowIdx}`}>
        {columns.map((col) => (
          <TableCell
            key={`${col.id}-skeleton-${rowIdx}`}
            sx={{
              width: `${col.width}px`,
              paddingLeft: `${col.paddingLeft || 0}px`,
              borderBottom: "1px solid lightgray",
              textAlign: "center",
            }}
          >
            <Skeleton variant="text" width="80%" height={20} />
          </TableCell>
        ))}
      </TableRow>
    ));

  const renderDataRows = (data, columns) =>
    data.map((row, idx) => (
      <TableRow key={idx} hover>
        {columns.map((col) => {
          // 셀 내용 구성
          let cellContent;

          if (col.id === "url") {
            cellContent = (
              <Button
                variant="outlined"
                size="small"
                endIcon={<LaunchIcon />}
                href={row[col.id]}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  minWidth: "auto",
                  textTransform: "none",
                  fontSize: "0.75rem",
                  padding: "2px 6px",
                }}
              >
                Link
              </Button>
            );
          } else if (col.id === "cvss") {
            const { label, color } = getCvssLabel(row[col.id]);
            cellContent = (
              <Chip
                label={label}
                color={color}
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            );
          } else if (col.id === "patch") {
            // 🔹 Tooltip 없이 Patch 버튼만
            cellContent = renderPatchButton(row);
          } else {
            cellContent = row[col.id] ?? "-";
          }

          // Tooltip title 설정 (patch에는 Tooltip 없음)
          const tooltipTitle =
            col.id === "url"
              ? row[col.id] || "-"
              : col.id === "patch"
              ? ""
              : row[col.id] || "-";

          const needsTooltip = col.id !== "patch"; // patch는 hover 시 아무것도 안 뜨게

          const inner = (
            <Typography
              variant="h7"
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {cellContent}
            </Typography>
          );

          return (
            <TableCell
              key={col.id}
              sx={{
                width: `${col.width}px`,
                borderBottom: "1px solid lightgray",
                py: 0.5,
                px: 1.25,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {needsTooltip ? (
                <Tooltip title={tooltipTitle} arrow>
                  {inner}
                </Tooltip>
              ) : (
                inner
              )}
            </TableCell>
          );
        })}
      </TableRow>
    ));

  return (
    <>
      {/* --------------------------------- CVE 테이블 ----------------------------------------- */}

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgb(139,53,53)" }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{
                      width: `${col.width}px`,
                      paddingLeft: `${col.paddingLeft || 0}px`,
                      borderBottom: "1px solid lightgray",
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && data.length === 0
                ? renderSkeletonRows(rowsPerPage, columns)
                : renderDataRows(paginatedData, columns)}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ----------------- 페이지네이션 ----------------- */}
      </Paper>

      {/* 버전 모달 (예전 그대로) */}
      <VersionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ossName={modalTitle}
        versionList={versionList}
      />

      {/* PATCH MODAL */}
      <PatchModal
        open={patchOpen}
        onClose={() => {
          setPatchOpen(false);
          setPatchTarget(null);
          setPatchResult([]);
        }}
        patchTarget={patchTarget}
        patchResult={patchResult}
        patchLoading={patchLoading}
      />
    </>
  );
};

export default CveTable;
