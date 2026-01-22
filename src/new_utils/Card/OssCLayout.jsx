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
  const handleCardSortChange = (newKey, newOrder) => {
    onSort(newKey, newOrder);
  };

  const sortableColumns = useMemo(
    () => columns.filter((col) => !["num", "github_url"].includes(col.id)),
    [columns],
  );

  return (
    <>
      
        <CardSortUI
          columns={[
            { key: "oss_name", label: "Name" },
            { key: "github_stars", label: "Stars" },
            { key: "detected_counts", label: "Detected" },
            { key: "language", label: "Language" },
          ]}
          sortKey={orderBy}
          sortOrder={order}
          onChange={handleCardSortChange}
        />

        <Card
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
            p: 3,
            border: "1px solid rgba(147, 147, 147, 1)",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {loading && data.length === 0 ? (
                Array.from({ length: rowsPerPage }).map((_, idx) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`skeleton-${idx}`}>
                    <Card variant="outlined" sx={{ p: 2, height: 160 }}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={18} />
                      <Skeleton
                        variant="rectangular"
                        height={36}
                        sx={{ mt: 2 }}
                      />
                    </Card>
                  </Grid>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                    <OssCard
                      data={row}
                      index={(page - 1) * rowsPerPage + idx + 1}
                      onShowVersions={onShowVersions}
                    />
                  </Grid>
                ))
              ) : (
                <Grid size={12}>
                  <Typography
                    align="center"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    No data available
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
    </>
  );
};

export default CardLayout;
