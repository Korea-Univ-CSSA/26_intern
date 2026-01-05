import React, { useState, useEffect, useRef } from "react";
import { customAxios } from "../../utils/CustomAxios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Button,
  Skeleton,
  Box,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import VersionModal from "./VersionModal";
import PatchModal from "../../utils/PatchModal";

// 🔹 열 정의 (width 조정)
const columns = [
  { id: "num", label: "No.", width: 60, paddingLeft: 10 },
  { id: "cveName", label: "CVE", width: 140, paddingLeft: 20 },
  { id: "functionId", label: "Function Name", width: 220, paddingLeft: 20 },
  { id: "cvss", label: "CVSS", width: 80, paddingLeft: 20 },
  { id: "patch", label: "Patch", width: 90, paddingLeft: 10 },
  { id: "url", label: "Url", width: 90, paddingLeft: 10 },
];

const CveTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState("num");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [versionList, setVersionList] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSeverities, setSelectedSeverities] = useState(new Set());
  const [availableYears, setAvailableYears] = useState([]);

  const [selectedFunction, setSelectedFunction] = useState("");
  const [availableFunctions, setAvailableFunctions] = useState([]);

  const rowsPerPage = 20;
  const isInitialLoad = useRef(false);

  const isSearching = searchQuery.trim().length > 0;

  // 🔹 Patch Modal 관련 상태
  const [patchOpen, setPatchOpen] = useState(false);
  const [patchTarget, setPatchTarget] = useState(null);
  const [patchResult, setPatchResult] = useState([]);
  const [patchLoading, setPatchLoading] = useState(false);

  // -------------------- 초기 데이터 로드 --------------------
  useEffect(() => {
    if (!isInitialLoad.current) {
      isInitialLoad.current = true;
      fetchInitialData();
    }
  }, []);

  useEffect(() => {
    const functionSet = new Set();
    data.forEach((item) => {
      if (item.functionId) functionSet.add(item.functionId);
    });
    const sortedFunctions = Array.from(functionSet).sort();
    setAvailableFunctions(sortedFunctions);
  }, [data]);

  // 🔹 파일 이름으로 VDB 조회
  const fetchVdbByFilename = async (filename) => {
    const res = await customAxios.get("/api/search/vdb/search/desc/file-name", {
      params: { filename },
    });

    return Array.isArray(res.data) ? res.data : [];
  };

  // 🔹 Patch 버튼 렌더링 (Tooltip 없음)
  const renderPatchButton = (row) => (
    <Button
      size="small"
      variant="contained"
      onClick={async () => {
        try {
          const filePath = row.file || "";

          // ✅ 1️⃣ @@ 앞까지만
          const beforeAt = filePath.split("@@")[0];

          // ✅ 2️⃣ 마지막 '/' 뒤 (파일명만)
          const baseName = beforeAt.substring(beforeAt.lastIndexOf("/") + 1);
          // baseName:
          // CVE-2015-5232_9.3_CWE-362_..._fm_cmd.c

          // ✅ 3️⃣ 뒤에서 '_' 기준으로 나눔
          const parts = baseName.split("_");

          // ✅ 4️⃣ 마지막 조각 = 진짜 파일명
          const fileName = parts[parts.length - 1];
          // 👉 cmd.c

          const patchTarget = {
            ...row,
            fileName, // ✅ "cmd.c"
          };

          setPatchTarget(patchTarget);
          setPatchOpen(true);
          setPatchLoading(true);

          // 🔹 기존 VDB 조회 로직 유지
          const cveIdx = filePath.indexOf("CVE-");
          const processed =
            cveIdx === -1 ? filePath : filePath.substring(cveIdx);

          const data = await fetchVdbByFilename(processed);
          setPatchResult(data);
        } catch (e) {
          console.error("Patch fetch error:", e);
          setPatchResult([]);
        } finally {
          setPatchLoading(false);
        }
      }}
      sx={{
        minWidth: 64,
        textTransform: "none",
        fontSize: "0.75rem",
        padding: "2px 8px",
        backgroundColor: "rgb(139,53,53)",
        "&:hover": {
          backgroundColor: "rgb(120,40,40)",
        },
      }}
    >
      PATCH
    </Button>
  );

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await customAxios.get("/api/search/vdb/all");
      const formatted = res.data.map((item, index) => ({
        num: index + 1,
        cveName: item.cveName,
        functionId: item.functionId,
        cvss: item.cvss,
        file: item.file, // 🔹 Patch용 file 정보 유지
        detected_counts: item.detected_counts,
        url: "https://cve.mitre.org/cgi-bin/cvename.cgi?name=" + item.cveName,
      }));
      setData(formatted);

      // Extract years from CVE names
      const yearSet = new Set();
      formatted.forEach((item) => {
        const match = item.cveName?.match(/^CVE-(\d{4})/);
        if (match) yearSet.add(parseInt(match[1]));
      });
      const sortedYears = Array.from(yearSet).sort((a, b) => b - a); // recent first
      setAvailableYears(sortedYears);
    } catch (err) {
      console.error("초기 데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await customAxios.get("/api/search/vdb/search", {
        params: { query: searchQuery.trim() },
      });
      const formatted = res.data.map((item, index) => ({
        num: index + 1,
        cveName: item.cveName,
        functionId: item.functionId,
        cvss: item.cvss,
        file: item.file, // 🔹 검색 결과에도 file 넣어줘야 Patch 버튼이 동작함
        detected_counts: item.detected_counts,
        url: "https://cve.mitre.org/cgi-bin/cvename.cgi?name=" + item.cveName,
      }));
      setData(formatted);
      setPage(1);
      setPageGroup(0);
    } catch (err) {
      console.error("Failed Search:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setPageGroup(0);
  }, [selectedYear, selectedSeverities]);

  const sortedData = [...data].sort((a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];
    const isNumber = typeof valA === "number" && typeof valB === "number";
    if (isNumber) return order === "asc" ? valA - valB : valB - valA;
    const strA = (valA ?? "").toString().toLowerCase();
    const strB = (valB ?? "").toString().toLowerCase();
    return order === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });

  const getCvssLabel = (score) => {
    const num = parseFloat(score);

    // ✅ 파싱 불가 or 0.0 은 Unknown
    if (isNaN(num) || num <= 0) {
      return { label: "Unknown", color: "default" }; // 회색
    }

    if (num < 4.0) {
      return { label: "Low", color: "success" };
    }

    if (num < 7.0) {
      return { label: "Medium", color: "warning" };
    }

    if (num < 9.0) {
      return { label: "High", color: "error" };
    }

    // ✅ 9.0 이상
    return { label: "Critical", color: "secondary" };
  };

  // Function Name 필터링
  const filteredData = sortedData.filter((item) => {
    const cveYear = parseInt(item.cveName?.split("-")[1]);
    const yearOk = !selectedYear || parseInt(selectedYear) === cveYear;

    const { label } = getCvssLabel(item.cvss);
    const severityOk =
      selectedSeverities.size === 0 || selectedSeverities.has(label);

    const query = searchQuery.trim().toLowerCase();
    const cveName = item.cveName?.toLowerCase() ?? "";
    const functionId = item.functionId?.toLowerCase() ?? "";

    const matchesSearch =
      query === "" || cveName.includes(query) || functionId.includes(query);

    return yearOk && severityOk && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSort = (colId) => {
    const isAsc = orderBy === colId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(colId);
  };

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setPageGroup(Math.floor((newPage - 1) / 10));
    }
  };

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

  const renderPageButtons = () => {
    const buttonCount = 10;
    const start = pageGroup * buttonCount + 1;
    const end = Math.min(totalPages, start + buttonCount - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
      (i) => (
        <Button
          key={i}
          variant="contained"
          onClick={() => handleChangePage(i)}
          sx={{
            margin: "0 2px",
            width: "40px",
            minWidth: "40px",
            backgroundColor: i === page ? "rgb(134,32,32)" : "rgb(194,62,62)",
            color: i === page ? "white" : "black",
            "&:hover": {
              backgroundColor: i === page ? "rgb(134,32,32)" : "rgb(194,62,62)",
              opacity: 0.8,
            },
          }}
        >
          {i}
        </Button>
      )
    );
  };

  return (
    <>
      {/* ----------------- 상단 필터 박스 ----------------- */}
      <Box
        sx={{
          display: "flex",
          border: "1px solid #ccc",
          borderRadius: 1,
          padding: "10px 10px 0 10px",
          marginBottom: 2,
        }}
      >
        {/* CVE / Function Name 검색 */}
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}>
          <Typography variant="h7" gutterBottom>
            Search OSS Name
          </Typography>
          <TextField
            label="Search CVE or Function Name"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 350 }}
          />
        </Box>

        {/* Year 필터 */}
        <Box
          sx={{ display: "flex", flexDirection: "column", margin: "0 20px" }}
        >
          <Typography variant="h7" gutterBottom>
            Year
          </Typography>
          <Box sx={{ marginRight: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* CVSS 필터 */}
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}>
          <Typography variant="h7" gutterBottom>
            CVSS
          </Typography>
          <Box>
            {["Critical", "High", "Medium", "Low", "Unknown"].map((level) => (
              <Chip
                key={level}
                label={level}
                clickable
                variant={selectedSeverities.has(level) ? "filled" : "outlined"}
                color={
                  level === "Critical"
                    ? "secondary" // 보라
                    : level === "High"
                    ? "error" // 빨강
                    : level === "Medium"
                    ? "warning" // 노랑
                    : level === "Low"
                    ? "success" // 초록
                    : "default" // Unknown → 회색
                }
                onClick={() => {
                  const updated = new Set(selectedSeverities);
                  if (updated.has(level)) updated.delete(level);
                  else updated.add(level);
                  setSelectedSeverities(updated);
                }}
                sx={{ mr: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* ----------------- 테이블 ----------------- */}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "10px 0",
            gap: "4px",
          }}
        >
          <Box>
            <IconButton
              onClick={() => handleChangePage(1)}
              disabled={page === 1}
            >
              {"<<"}
            </IconButton>
            <IconButton
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 1}
            >
              {"<"}
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: "5px" }}>{renderPageButtons()}</Box>

          <Box>
            <IconButton
              onClick={() => handleChangePage(page + 1)}
              disabled={page === totalPages}
            >
              {">"}
            </IconButton>
            <IconButton
              onClick={() => handleChangePage(totalPages)}
              disabled={page === totalPages}
            >
              {">>"}
            </IconButton>
          </Box>
        </Box>
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
