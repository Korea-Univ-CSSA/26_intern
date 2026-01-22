import React, { useState, useEffect, useRef } from "react";
import { customAxios } from "../../utils/CustomAxios";
import {
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import CveFilters from "./CveFilters";
import CveTable from "./CveTable";
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

const CveMain = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [orderBy, setOrderBy] = useState("num");
  const [order, setOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const [jumpPage, setJumpPage] = useState("");

  const [availableYears, setAvailableYears] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [versionList, setVersionList] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const [layout, setLayout] = useState("Table");
  const options = ["Table", "Card"];

  // 🔹 Patch Modal 관련 상태
  const [patchOpen, setPatchOpen] = useState(false);
  const [patchTarget, setPatchTarget] = useState(null);
  const [patchResult, setPatchResult] = useState([]);
  const [patchLoading, setPatchLoading] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    year: "",
    cvss: [],
  });

  const [selectedFunction, setSelectedFunction] = useState("");
  const [availableFunctions, setAvailableFunctions] = useState([]);

  const rowsPerPage = 20;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const isInitialLoad = useRef(false);

  // -------------------- 초기 데이터 로드 --------------------
  useEffect(() => {
    if (!isInitialLoad.current) {
      isInitialLoad.current = true;
      fetchInitialData();
    }
  }, []);

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

  // -------------------- Filter / Sort --------------------
  useEffect(() => {
    const query = filters.search.trim().toLowerCase();

    const result = data.filter((item) => {
      const file = item.file?.toLowerCase() ?? "";
      const functionId = item.functionId?.toLowerCase() ?? "";
      const cvss = item.cvss ?? 0;

      const matchSearch =
        !query || file.includes(query) || functionId.includes(query);

      const matchYear =
        !filters.year || item.cveName?.startsWith(`CVE-${filters.year}`);

      const { label } = getCvssLabel(item.cvss);
      const matchCvss =
        filters.cvss.length === 0 || filters.cvss.includes(label);

      return matchSearch && matchYear && matchCvss;
    });

    setFilteredData(result);
    setPage(1);
    setPageGroup(0);
  }, [filters, data]);

  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];

    if (typeof valA === "number" && typeof valB === "number") {
      return order === "asc" ? valA - valB : valB - valA;
    }

    return order === "asc"
      ? String(valA ?? "").localeCompare(String(valB ?? ""))
      : String(valB ?? "").localeCompare(String(valA ?? ""));
  });

  const handleSort = (colId) => {
    const isAsc = orderBy === colId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(colId);
  };

  const getCvssLabel = (score) => {
    const num = parseFloat(score);

    if (isNaN(num) || num <= 0) {
      return { label: "Unknown", color: "default" };
    }
    if (num < 4) {
      return { label: "Low", color: "success" };
    }
    if (num < 7) {
      return { label: "Medium", color: "warning" };
    }
    if (num < 9) {
      return { label: "High", color: "error" };
    }
    return { label: "Critical", color: "secondary" };
  };

  const fetchVdbByFilename = async (filename) => {
    const res = await customAxios.get("/api/search/vdb/search/desc/file-name", {
      params: { filename },
    });
    return Array.isArray(res.data) ? res.data : [];
  };
  const handlePatchClick = async (row) => {
    try {
      const filePath = row.file || "";

      // 1️⃣ remove @@ part
      const beforeAt = filePath.split("@@")[0];

      // 2️⃣ extract base file name
      const baseName = beforeAt.substring(beforeAt.lastIndexOf("/") + 1);

      // 3️⃣ get actual file name (after last "_")
      const parts = baseName.split("_");
      const fileName = parts[parts.length - 1];

      const patchTarget = {
        ...row,
        fileName, // ✅ important for PatchModal
      };

      setPatchTarget(patchTarget);
      setPatchOpen(true);
      setPatchLoading(true);

      // 4️⃣ process filename for backend search
      const cveIdx = filePath.indexOf("CVE-");
      const processed = cveIdx === -1 ? filePath : filePath.substring(cveIdx);

      const result = await fetchVdbByFilename(processed);
      setPatchResult(result);
    } catch (err) {
      console.error("Patch fetch failed:", err);
      setPatchResult([]);
    } finally {
      setPatchLoading(false);
    }
  };

  // --------------------페이지네이션--------------------

  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

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
        handleChangePage(target);
      }
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [jumpPage, totalPages, page]);

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setPageGroup(Math.floor((newPage - 1) / 10));
    }
  };

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
      ),
    );
  };
  return (
    <>
      {/* ----------------- 상단 필터 박스 ----------------- */}
      <>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          {/* Title */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            CVE Data List
          </Typography>

          <Stack direction="row" spacing={1}>
            {options.map((option) => (
              <Chip
                key={option}
                label={option}
                clickable
                disabled={loading} 
                color={layout === option ? "primary" : "default"}
                variant={layout === option ? "filled" : "outlined"}
                onClick={() => setLayout(option)}
              />
            ))}
          </Stack>
        </Box>
      </>

      {/* --------------------------------- oss 필터 ----------------------------------------- */}
      <CveFilters
        filters={filters}
        onChange={setFilters}
        availableYears={availableYears}
      />

      {/* --------------------------------- CVE 테이블 ----------------------------------------- */}

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {/* --------------------------------- 페이지네이션 ----------------------------------------- */}
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
            <IconButton
              onClick={() => handleChangePage(1)}
              disabled={page === 1}
            >
              {"<<"}
            </IconButton>
            <IconButton
              onClick={() => handleChangePage(page - 10)}
              disabled={page <= 10}
            >
              {"<"}
            </IconButton>
          </Box>

          {/* Page numbers */}
          <Box sx={{ display: "flex", gap: "5px" }}>{renderPageButtons()}</Box>

          {/* Next / Last */}
          <Box>
            <IconButton
              onClick={() => handleChangePage(page + 10)}
              disabled={page + 10 > totalPages}
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

          {/* Jump to page (input only) */}
          <TextField
            size="small"
            value={jumpPage}
            placeholder="Jump to.."
            onChange={(e) => setJumpPage(e.target.value)}
            onBlur={() => {
              const target = Number(jumpPage);
              if (
                Number.isInteger(target) &&
                target >= 1 &&
                target <= totalPages
              ) {
                handleChangePage(target);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const target = Number(jumpPage);
                if (
                  Number.isInteger(target) &&
                  target >= 1 &&
                  target <= totalPages
                ) {
                  handleChangePage(target);
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
        </Box>

        <CveTable
          columns={columns}
          data={data}
          loading={loading}
          order={order}
          orderBy={orderBy}
          rowsPerPage={rowsPerPage}
          page={page}
          paginatedData={paginatedData}
          onSort={handleSort}
          onPatchClick={handlePatchClick}
          getCvssLabel={getCvssLabel}
        />
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

export default CveMain;
