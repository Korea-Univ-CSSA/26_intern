import { useMemo, useState } from "react";
import { Card, CardContent, Grid, Container } from "@mui/material";
import CardSortUI from "./CardSortUI";
import OssCard from "./OssCard";

const CardLayout = ({
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
}) => {
  const sortableColumns = useMemo(
    () => columns.filter((col) => !["num", "github_url"].includes(col.id)),
    [columns],
  );

  const [sortKey, setSortKey] = useState(sortableColumns[0]?.id ?? "");
  const [sortOrder, setSortOrder] = useState("asc");

  return (
    <>
      {/* Sort UI */}
      <CardSortUI
        columns={sortableColumns}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onChange={(key, order) => {
          setSortKey(key);
          setSortOrder(order);
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "80vh",
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
                <OssCard
                  language={"Java"}
                  date={"22222"}
                  link={"https://mui.com/material-ui/react-link/"}
                />
              </Grid>
              <Grid size={4}>
                <OssCard />
              </Grid>
              <Grid size={4}>
                <OssCard />
              </Grid>
              <Grid size={4}>
                <OssCard />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default CardLayout;
