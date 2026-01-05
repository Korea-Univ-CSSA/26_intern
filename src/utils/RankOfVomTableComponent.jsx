import React, { useState } from "react";
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

const RankOfVomTableComponent = ({ response }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 3;
  const [pageGroup, setPageGroup] = useState(0);

  const rawData = response?.cve_db || [];
  const totalPages = Math.ceil(rawData.length / rowsPerPage);

  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

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

  const renderPageButtons = ({
    buttonWidth = "40px",
    activeColor = "rgb(134, 32, 32)",
    inactiveColor = "rgb(194, 62, 62)",
  } = {}) => {
    const button_num = 4;
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

  // ✅ 현재 페이지의 데이터 + 빈 줄 채우기
  const pageData = [
    ...rawData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    ...Array(
      Math.max(
        0,
        rowsPerPage -
          rawData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .length
      )
    ).fill({ name: "", count: "" }),
  ];

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#782333",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h7" color="lightgray">
          VOM CVE Results
        </Typography>
        <Typography variant="h4" color="white">
          {response?.total_cve_number || "-"}
        </Typography>
      </Box>
      <Box
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          minWidth: "300px",
          maxWidth: "300px",
        }}
      >
        <TableContainer
          sx={{
            minHeight: "300px",
            overflowY: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{
                    backgroundColor: "#782333",
                    color: "white",
                    fontSize: "15px",
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
              {pageData.map((file, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    height: "56px",
                    "& td": {
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    },
                  }}
                >
                  <TableCell align="center">
                    {file.name ? index + 1 + page * rowsPerPage : ""}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      wordBreak: "break-all",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "150px",
                      cursor: file.name ? "pointer" : "default",
                    }}
                  >
                    {file?.name ? (
                      <Tooltip title={file.name} placement="top">
                        <a
                          href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${file?.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            textDecoration: "none",
                            color: "#1976D2",
                            fontWeight: "bold",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.textDecoration = "underline")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.textDecoration = "none")
                          }
                        >
                          {file?.name || "-"}
                        </a>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </TableCell>

                  <TableCell align="center">{file.count ?? ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
          <IconButton
            onClick={handlePrevGroup}
            disabled={pageGroup === 0}
            sx={{ color: pageGroup === 0 ? "gray" : "black" }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <Box sx={{ display: "flex", gap: "5px" }}>{renderPageButtons()}</Box>

          <IconButton
            onClick={handleNextGroup}
            disabled={(pageGroup + 1) * 3 >= totalPages}
            sx={{ color: (pageGroup + 1) * 3 >= totalPages ? "gray" : "black" }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default RankOfVomTableComponent;
