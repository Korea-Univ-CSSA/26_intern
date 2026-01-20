import IndividualCard from "./OssCard";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
} from "@mui/material";

const lan = "Java";
const year = "2002";

const CardLayout = (
  // Commons
  columns,
  data,
  loading,
  order,
  orderBy,
  onSort,
  rowsPerPage,
  page,
  paginatedData,
  // For OSS
  onShowVersions,
  // For CVE
  onPatchClick,
  getCvssLabel,
) => {
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
            Card_layout
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
          <CardContent sx={{ p: 0 }}>
            <Grid container spacing={2}>
              <Grid size={4}>
                <IndividualCard
                  language={lan}
                  date={year}
                  link={"https://mui.com/material-ui/react-link/"}
                />
              </Grid>
              <Grid size={4}>
                <IndividualCard />
              </Grid>
              <Grid size={4}>
                <IndividualCard />
              </Grid>
              <Grid size={4}>
                <IndividualCard />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default CardLayout;
