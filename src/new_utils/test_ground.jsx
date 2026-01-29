import React from "react";
import { Container, Typography, Card, CardContent, Box } from "@mui/material";
import Sunburst from "react-sunburst-chart";

const myData = {
  name: "root",
  children: [
    {
      name: "2016",
      value: 3,
    },
    {
      name: "2020",
      children: [
        {
          name: "leafBA",
          value: 5,
        },
        {
          name: "leafBB",
          children: [
            {
              name: "leafBA",
              value: 5,
            },
            {
              name: "leafBB",
              value: 1,
            },
          ],
        },
      ],
    },
  ],
};

export const test_ground = () => {
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
            Now testing : Sunburst
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
              sx={{ textAlign: "left", fontWeight: "bold", mb: 2 }}
            >
              Sunburst Chart
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: 400, // 👈 important
              }}
            >
              <Sunburst data={myData} width={400} height={400} />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default test_ground;
