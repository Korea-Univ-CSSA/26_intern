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
  Collapse,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import VersionModal from "./VersionModal";
import OssTableFilters from "./OssTableFilters";

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

const OssTable = () => {
  const [data, setData] = useState([]);
  const [ossAllCount, setOssAllCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState("num");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [versionList, setVersionList] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredData, setFilteredData] = useState([]);

  const [filterOpen, setFilterOpen] = useState(true); // true로 열림 상태 유지

  const rowsPerPage = 20;
  const totalPages = Math.ceil(ossAllCount / rowsPerPage);
  const isInitialLoad = useRef(false);

  useEffect(() => {
    if (!isInitialLoad.current) {
      isInitialLoad.current = true;
      fetchInitialData();
    }
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = data.filter((item) => {
      const oss = item.oss_name?.toLowerCase() ?? "";
      const version = item.version?.toLowerCase() ?? "";
      const lang = item.language?.toLowerCase() ?? "";
      return (
        oss.includes(query) || version.includes(query) || lang.includes(query)
      );
    });
    setFilteredData(result);
    setPage(1);
    setPageGroup(0);
    setOssAllCount(result.length);
  }, [searchQuery, data]); // ✅ 두 값이 바뀔 때마다 필터링

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

  const sortedData = [...filteredData].sort((a, b) => {
    const query = searchQuery.trim().toLowerCase();
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
    page * rowsPerPage
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
      )
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
      </Box>

      <OssTableFilters
        data={data}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilteredData={setFilteredData}
        setPage={setPage}
        setPageGroup={setPageGroup}
        setOssAllCount={setOssAllCount}
      />

      {/* --------------------------------- oss 테이블 ----------------------------------------- */}
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
                        onClick={() => handleSort(col.id)}
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

            <TableBody>
              {loading && data.length === 0 ? (
                Array.from({ length: rowsPerPage }).map((_, rowIdx) => (
                  <TableRow key={`skeleton-row-${rowIdx}`}>
                    {columns.map((col) => (
                      <TableCell
                        key={`${col.id}-skeleton-${rowIdx}`}
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
                              variant=""
                              sx={{
                                fontSize: "10px",
                                fontWeight: "bold",
                                width: "100px",
                                color: "rgb(117, 37, 37)",
                              }}
                              onClick={() =>
                                handleShowVersions(row.oss_name, row.language)
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

                  {/* 빈 행 추가 */}
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
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      py={2}
                    >
                      {/* <CircularProgress /> */}
                      <Typography variant="body2">No Data</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 1}
              sx={{ color: page === 1 ? "gray" : "black" }}
            >
              {"<"}
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: "5px" }}>{renderPageButtons()}</Box>

          <Box>
            <IconButton
              onClick={() => handleChangePage(page + 1)}
              disabled={page === totalPages}
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

export default OssTable;
