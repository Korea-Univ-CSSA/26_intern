import React from "react";
import { Container, Typography, Card, CardContent, Box } from "@mui/material";
import CveTable from "./CveTable";

export const VdbPage = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "rgb(247, 243, 236)",
          textAlign: "left",
          justifyContent: "center",
          width: "100%",
          py: 6,
          marginBottom: "30px",
        }}
      >
        <Box sx={{ width: "1000px", padding: "0 30px 0 30px" }}>
          <Typography
            variant="h4"
            sx={{ color: "rgb(139, 53, 53)", fontWeight: "bold" }}
          >
            CVE
          </Typography>
        </Box>
      </Box>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "80vh",
          width: "1000px",
          marginBottom: "30px",
        }}
      >
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
            p: 3,
            border: "1px solid rgba(147, 147, 147, 1)",
          }}
        >
          <CardContent sx={{ padding: 0 }}>
            <Typography
              variant="h5"
              sx={{
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              CVE Data List
            </Typography>

            <CveTable />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default VdbPage;
