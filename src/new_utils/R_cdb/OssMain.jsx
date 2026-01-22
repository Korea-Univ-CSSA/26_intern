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
  Fade,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import VersionModal from "./VersionModal";
import OssFilters from "./OssFilters";
import OssTable from "./OssTable";
import CardLayout from "../Card/CardLayout";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const columns = [
  { id: "num", label: " ", width: 100, paddingLeft: 0 },
  { id: "oss_name", label: "OSS", width: 180, paddingLeft: 40 },
  { id: "version", label: "Version", width: 130, paddingLeft: 35 },
  { id: "language", label: "Language", width: 160, paddingLeft: 40 },
  { id: "github_stars", label: "GitHub Stars", width: 100, paddingLeft: 0 },
  {
    id: "detected_counts",
    label: "Detected",
    width: 100,
    paddingLeft: 25,
  },
  { id: "github_url", label: "GitHub", width: 100, paddingLeft: 0 },
];

//----------------------------------------------------------------- 무한랜더링 최적화 필요

const OssMain = () => {
  const [data, setData] = useState([]);
  const [ossAllCount, setOssAllCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState("num");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const [layout, setLayout] = useState("Table");
  const options = ["Table", "Card"];

  const [modalOpen, setModalOpen] = useState(false);
  const [versionList, setVersionList] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    languages: [],
    stars: [0, 0],
    detected: [0, 0],
  });

  const [minStar, setMinStar] = useState(0);
  const [maxStar, setMaxStar] = useState(0);

  const [minDetect, setMinDetect] = useState(0);
  const [maxDetect, setMaxDetect] = useState(0);

  const rowsPerPage = 20;
  const totalPages = Math.ceil(ossAllCount / rowsPerPage);
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
      const res = await customAxios.get("/api/search/cdb/all");
      const formatted = res.data.map((item, index) => ({
        num: index + 1,
        oss_name: item.oss_name,
        version: item.version,
        language:
          item.lang === "C"
            ? "C/C++"
            : item.lang === "java"
              ? "Java"
              : item.lang === "python"
                ? "Python"
                : item.lang === "go"
                  ? "Go"
                  : item.lang === "php"
                    ? "PHP"
                    : "-",
        github_stars: item.github_stars,
        detected_counts: item.detected_counts,
        github_url: item.github_link,
      }));

      // console.log("초기 데이터 로드:", formatted);
      setData(formatted);
      setFilteredData(formatted);
      setOssAllCount(formatted.length); // 총 개수 계산
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
      const oss = item.oss_name?.toLowerCase() ?? "";
      const version = item.version?.toLowerCase() ?? "";
      const lang = item.language?.toLowerCase() ?? "";
      const stars = item.github_stars ?? 0;
      const detect = item.detected_counts ?? 0;

      const matchSearch =
        !query ||
        oss.includes(query) ||
        version.includes(query) ||
        lang.includes(query);

      const matchLanguage =
        filters.languages.length === 0 ||
        filters.languages.includes(item.language);

      const matchStars = stars >= filters.stars[0] && stars <= filters.stars[1];
      const matchDetech =
        detect >= filters.detected[0] && detect <= filters.detected[1];

      return matchSearch && matchLanguage && matchStars && matchDetech;
    });

    setFilteredData(result);
    setPage(1);
    setPageGroup(0);
    setOssAllCount(result.length);
  }, [filters, data]);

  useEffect(() => {
    if (data.length > 0) {
      const stars = data.map((d) => d.github_stars ?? 0);
      const sMin = Math.min(...stars);
      const sMax = Math.max(...stars);

      setMinStar(sMin);
      setMaxStar(sMax);

      const detected = data.map((d) => d.detected_counts ?? 0);
      const dMin = Math.min(...detected);
      const dMax = Math.max(...detected);

      setMinDetect(dMin);
      setMaxDetect(dMax);

      setFilters((prev) => ({
        ...prev,
        stars: [sMin, sMax],
        detected: [dMin, dMax],
      }));
    }
  }, [data]);

  const sortedData = [...filteredData].sort((a, b) => {
    const query = filters.search.trim().toLowerCase();
    const exactA = a.oss_name?.toLowerCase() === query;
    const exactB = b.oss_name?.toLowerCase() === query;

    // 1️⃣ 정확 매치 우선
    if (exactA && !exactB) return -1;
    if (!exactA && exactB) return 1;

    // 2️⃣ 기존 정렬 로직
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

  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handleSort = (colId) => {
    const isAsc = orderBy === colId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(colId);
  };

  const handleShowVersions = async (ossName, lang) => {
    try {
      // console.log("버전 불러오기:", ossName, lang);

      const langMap = {
        "C/C++": "c",
        Java: "java",
        Python: "python",
        Go: "go",
        PHP: "php",
      };

      const langKey = langMap[lang];
      if (!langKey) {
        // console.warn("지원하지 않는 언어:", lang);
        return;
      }

      const res = await customAxios.get(`/api/search/cdb/ver/${langKey}`, {
        params: { ossName },
      });

      const versionList = res.data.map((item) => item.ver);
      // console.log("버전 데이터:", versionList);

      setVersionList(versionList);
      setModalTitle(ossName);
      setModalOpen(true);
    } catch (err) {
      console.error("버전 불러오기 실패:", err);
    }
  };

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
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        {/* Title */}
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          OSS Component Data List
        </Typography>

        <Stack direction="row" spacing={1}>
          {options.map((option) => (
            <Chip
              key={option}
              label={option}
              clickable
              color={layout === option ? "primary" : "default"}
              variant={layout === option ? "filled" : "outlined"}
              onClick={() => setLayout(option)}
            />
          ))}
        </Stack>
      </Box>

      {/* --------------------------------- oss 필터 ----------------------------------------- */}
      <OssFilters
        filters={filters}
        onChange={setFilters}
        minStar={minStar}
        maxStar={maxStar}
        minDetect={minDetect}
        maxDetect={maxDetect}
      />

      {/* --------------------------------- oss 테이블 ----------------------------------------- */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Fade in={layout === "Table"} timeout={200} mountOnEnter unmountOnExit>
          <div>
            <OssTable
              columns={columns}
              data={data}
              loading={loading}
              order={order}
              orderBy={orderBy}
              onSort={handleSort}
              rowsPerPage={rowsPerPage}
              page={page}
              paginatedData={paginatedData}
              onShowVersions={handleShowVersions}
            />
          </div>
        </Fade>
        <Fade in={layout === "Card"} timeout={200} mountOnEnter unmountOnExit>
          <div>
            <CardLayout
              columns={columns}
              data={data}
              loading={loading}
              order={order}
              orderBy={orderBy}
              onSort={handleSort}
              rowsPerPage={rowsPerPage}
              page={page}
              paginatedData={paginatedData}
              onShowVersions={handleShowVersions}
            />
          </div>
        </Fade>
        {/* --------------------------------- page 바꾸기 ----------------------------------------- */}
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
              sx={{ color: page === 1 ? "gray" : "black" }}
            >
              {"<<"}
            </IconButton>
            <IconButton
              onClick={() => handleChangePage(page - 10)}
              disabled={page >= 1 && page <= 10}
              sx={{ color: page === 1 ? "gray" : "black" }}
            >
              {"<"}
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: "5px" }}>{renderPageButtons()}</Box>

          <Box>
            <IconButton
              onClick={() => handleChangePage(page + 10)}
              disabled={page === totalPages || page + 10 > totalPages}
              sx={{ color: page === totalPages ? "gray" : "black" }}
            >
              {">"}
            </IconButton>
            <IconButton
              onClick={() => handleChangePage(totalPages)}
              disabled={page === totalPages}
              sx={{ color: page === totalPages ? "gray" : "black" }}
            >
              {">>"}
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <VersionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ossName={modalTitle}
        versionList={versionList}
      />
    </>
  );
};

export default OssMain;
