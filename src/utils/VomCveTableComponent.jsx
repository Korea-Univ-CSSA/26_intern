import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import useFileStore from "../stores/useFileStore";

// ---------------------------------------------- 현재는 Vom으로는 vex 분석을 진행할수 없으므로 현재는 사용하지 않음(25-05-19 CSSA 김선규 연구원)-----------------------

const VomCveTableComponent = () => {
  const { selectedVomFiles, vomAddFile, vomRemoveFile } = useFileStore();

  // ✅ 체크된 항목 관리
  const [checkedItems, setCheckedItems] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [pageGroup, setPageGroup] = useState(0);

  // ✅ 페이지네이션에 필요한 페이지 수 계산
  const totalPages = Math.ceil(selectedVomFiles.length / rowsPerPage);

  // ✅ 페이지 그룹 변경 핸들러
  const handleNextGroup = () => {
    if ((pageGroup + 1) * 3 < totalPages) {
      setPageGroup(pageGroup + 1);
      setPage((pageGroup + 1) * 3);
    }
  };

  const handlePrevGroup = () => {
    if (pageGroup > 0) {
      setPageGroup(pageGroup - 1);
      setPage((pageGroup - 1) * 3);
    }
  };

  // ✅ 페이지 변경 핸들러
  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // ✅ 체크박스 변경 핸들러
  const handleCheckboxChange = (file) => {
    if (checkedItems.includes(file.cve)) {
      // 이미 체크된 경우 => 해제
      setCheckedItems(checkedItems.filter((item) => item !== file.cve));
      vomRemoveFile(file);
    } else {
      // 체크되지 않은 경우 => 추가
      setCheckedItems([...checkedItems, file.cve]);
      vomAddFile(file);
    }
  };

  // ✅ 전체 선택 핸들러
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // 모든 항목 선택
      const allFiles = selectedVomFiles.map((file) => file.cve);
      setCheckedItems(allFiles);
      allFiles.forEach((cve) => vomAddFile({ cve }));
    } else {
      // 모든 항목 해제
      setCheckedItems([]);
      selectedVomFiles.forEach((file) => vomRemoveFile(file));
    }
  };

  // ✅ 페이지네이션 버튼 생성
  const renderPageButtons = ({
    buttonWidth = "40px",
    activeColor = "rgb(134, 32, 32)",
    inactiveColor = "rgb(194, 62, 62)",
  } = {}) => {
    const button_num = 5;
    const buttons = [];
    const start = pageGroup * button_num;
    const end = Math.min(totalPages, start + button_num);

    for (let i = start; i < end; i++) {
      buttons.push(
        <Button
          key={i}
          variant="contained"
          onClick={() => handleChangePage(i)}
          sx={{
            margin: "0 2px",
            width: buttonWidth,
            minWidth: buttonWidth,
            backgroundColor: i === page ? activeColor : inactiveColor,
            color: i === page ? "white" : "black",
            "&:hover": {
              backgroundColor: i === page ? activeColor : inactiveColor,
              opacity: 0.8,
            },
          }}
        >
          {i + 1}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <Box
      sx={{
        padding: "0 20px 20px 20px",
        border: "1px solid rgb(153, 153, 153)",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "left", margin: "20px 0" }}>
        Selected VOM CVEs
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          minWidth: "600px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          overflowY: "hidden", // 🔥 스크롤 제거
          height: "310px", // 🔥 고정 높이 (56px x 5)
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                height: "32px", // 🔥 헤더 높이 줄임
              }}
            >
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  width: "80px",
                  padding: "4px 8px !important",
                }}
              >
                No.
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  width: "500px",
                  padding: "4px 8px !important",
                }}
              >
                CVE
              </TableCell>
              <TableCell
                align="center"
                sx={{ width: "50px", padding: "4px 8px !important" }}
              >
                <Checkbox
                  indeterminate={
                    checkedItems.length > 0 &&
                    checkedItems.length < selectedVomFiles.length
                  }
                  checked={
                    selectedVomFiles.length > 0 &&
                    checkedItems.length === selectedVomFiles.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  width: "120px",
                  padding: "4px 8px !important",
                }}
              />
            </TableRow>
          </TableHead>

          <TableBody>
            {[
              ...selectedVomFiles.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ),
              ...Array(
                Math.max(
                  0,
                  rowsPerPage - (selectedVomFiles.length % rowsPerPage)
                )
              ).fill({ cve: "" }),
            ].map((file, index) => (
              <TableRow
                key={`${file.cve}-${index}`}
                hover
                sx={{
                  height: "32px", // 🔥 Row 높이 줄임
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  align="center"
                  sx={{ width: "80px", padding: "4px 8px !important" }}
                >
                  {file.cve ? index + 1 + page * rowsPerPage : ""}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ width: "240px", padding: "4px 8px !important" }}
                >
                  {file.cve || "\u00A0"}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ width: "50px", padding: "4px 8px !important" }}
                >
                  {file.cve ? (
                    <Checkbox
                      checked={checkedItems.includes(file.cve)}
                      onChange={() => handleCheckboxChange(file)}
                    />
                  ) : (
                    "\u00A0"
                  )}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ width: "120px", padding: "4px 8px !important" }}
                >
                  {file.cve ? (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ padding: "2px 6px", fontSize: "12px" }} // 🔥 버튼 패딩과 폰트 크기 줄임
                      onClick={() => vomRemoveFile(file)}
                    >
                      Delete
                    </Button>
                  ) : (
                    "\u00A0"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ 페이지네이션 버튼 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "10px 0 10px 0",
          gap: "4px",
        }}
      >
        <IconButton onClick={handlePrevGroup} disabled={pageGroup === 0}>
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box sx={{ display: "flex", gap: "5px" }}>{renderPageButtons()}</Box>

        <IconButton
          onClick={handleNextGroup}
          disabled={(pageGroup + 1) * 3 >= totalPages}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default VomCveTableComponent;
