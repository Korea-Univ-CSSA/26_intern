import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

export default function IndividualCard({
  language,
  date,
  oss_name,
  author,
  star,
  detect,
  clickFunction,
  link,
}) {
  const colorPicker = () => {};
  return (
    <Card sx={{ maxWidth: 280 }}>
      {/* --------------------------------- Top Border----------------------------------------- */}
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1, // horizontal padding ↓
          py: 0.5, // vertical padding ↓
          backgroundColor: "black",
        }}
      >
        <Typography
          variant="body2" // ⬅️ smaller than h5
          sx={{ color: "white", fontSize: "12px", lineHeight: 1.2 }}
        >
          {language}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "white", fontSize: "12px", lineHeight: 1.2 }}
        >
          {date}
        </Typography>
      </CardContent>

      {/* --------------------------------- Middle content ----------------------------------------- */}
      <CardContent
        sx={{
          px: 1, // reduce horizontal padding
          py: 0.75, // reduce vertical padding
        }}
      >
        <Grid container spacing={0.5}>
          {/* Column 1 */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "12px",
                lineHeight: 1.25,
                fontWeight: 500,
              }}
            >
              {oss_name || "........"}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "11px",
                lineHeight: 1.25,
              }}
            >
              By {author || "....."}
            </Typography>
          </Grid>

          {/* Column 2 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              sx={{
                fontSize: "11px",
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              {star ? `⭐ : ${star}` : "⭐ : ???"}
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              {detect ? `🔍 : ${detect}` : "🔍 : ???"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      {/* --------------------------------- Bottom Section ----------------------------------------- */}
      <CardActions
        sx={{
          px: 1,
          py: 0.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          size="small"
          sx={{
            fontSize: "11px",
            minHeight: 24,
            padding: "2px 6px",
            textTransform: "none",
          }}
          onClick={() => clickFunction(oss_name, language)}
        >
          Version
        </Button>

        <Button
          size="small"
          component="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontSize: "11px",
            minHeight: 24,
            padding: "2px 6px",
            textTransform: "none",
          }}
        >
          Link
        </Button>
      </CardActions>
    </Card>
  );
}
