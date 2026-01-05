import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import CweListModal from "./CweListModal";

const MAX_CWE_VISIBLE = 5;

const CweDistributionBox = ({ pieCweData }) => {
  const [openCweModal, setOpenCweModal] = React.useState(false);

  const shown = pieCweData.slice(0, MAX_CWE_VISIBLE);
  const hidden = pieCweData.slice(MAX_CWE_VISIBLE);

  useEffect(() => {
    console.log("CweDistributionBox pieCweData : ", pieCweData);
  }, [pieCweData]);

  return (
    <>
      <Box
        sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          CWE Distribution
        </Typography>

        {/* ✅ Pie Chart */}
        <Box sx={{ width: "100%", height: 420 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieCweData}
                dataKey="num2"
                nameKey="x2"
                outerRadius={160}
                label
              >
                {pieCweData.map((entry, idx) => (
                  <Cell
                    key={`cwe-${entry.x2}-${idx}`}
                    fill={`hsl(${(idx * 137.508) % 360}, 65%, 55%)`}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* ✅ 가로 Legend (최대 5개 + ...) */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            fontSize: 12,
          }}
        >
          {shown.map((entry, idx) => (
            <Box
              key={entry.x2}
              sx={{
                display: "flex",
                alignItems: "center",
                maxWidth: 180,
              }}
              title={entry.x2}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: `hsl(${(idx * 137.508) % 360}, 65%, 55%)`,
                  mr: 0.8,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" noWrap>
                {entry.x2}
              </Typography>
            </Box>
          ))}

          {/* ✅ ... 버튼 → 모달 */}
          {hidden.length > 0 && (
            <Box
              sx={{
                cursor: "pointer",
                color: "rgba(161, 23, 23, 1)",
                fontWeight: 600,
                fontSize: "0.75rem",
                "&:hover": {
                  textDecoration: "underline",
                  color: "rgba(138, 31, 31, 1)",
                },
              }}
              onClick={() => setOpenCweModal(true)}
            >
              more...
            </Box>
          )}
        </Box>
      </Box>

      {/* ✅ CWE 전체 목록 모달 */}
      <CweListModal
        open={openCweModal}
        onClose={() => setOpenCweModal(false)}
        pieCweData={pieCweData}
      />
    </>
  );
};

export default CweDistributionBox;
