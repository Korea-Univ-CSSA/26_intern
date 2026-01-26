import { Card, CardContent, Grid, Typography, Skeleton } from "@mui/material";
import CardSortUI from "./CardSortUI";
import CveCard from "./CveCard";

const CveCardLayout = ({
  data,
  loading,
  order,
  orderBy,
  onSort,
  rowsPerPage,
  page,
  paginatedData,
  onPatchClick,
}) => {
  const handleCardSortChange = (newKey, newOrder) => {
    onSort(newKey, newOrder);
  };

  // last-row calculation (3 cards per row)
  const itemsPerRow = 3;
  const remainder = paginatedData.length % itemsPerRow;
  const lastRowStartIndex =
    remainder === 0 ? paginatedData.length : paginatedData.length - remainder;

  const fullRows = paginatedData.slice(0, lastRowStartIndex);
  const lastRow = paginatedData.slice(lastRowStartIndex);

  return (
    <>
      <CardSortUI
        columns={[
          { key: "cve_name", label: "CVE" },
          { key: "fun_name", label: "Function" },
          { key: "cvss_num", label: "CVSS" },
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
          {loading && data.length === 0 ? (
            <Grid container spacing={2}>
              {Array.from({ length: rowsPerPage }).map((_, idx) => (
                <Grid key={`skeleton-${idx}`} size={{ xs: 12, sm: 6, md: 4 }}>
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
              ))}
            </Grid>
          ) : paginatedData.length > 0 ? (
            <>
              {/* Full rows */}
              <Grid container spacing={2}>
                {fullRows.map((row, idx) => (
                  <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                    <CveCard
                      data={row}
                      index={(page - 1) * rowsPerPage + idx + 1}
                      onPatchClick={onPatchClick}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Last row */}
              {remainder !== 0 && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {lastRow.map((row, idx) => (
                    <Grid key={`last-${idx}`} size={{ xs: 12, sm: 6, md: 4 }}>
                      <CveCard
                        data={row}
                        index={
                          (page - 1) * rowsPerPage +
                          lastRowStartIndex +
                          idx +
                          1
                        }
                        onPatchClick={onPatchClick}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          ) : (
            <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
              No data available
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default CveCardLayout;
