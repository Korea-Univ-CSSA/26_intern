import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Grid, Link } from "@mui/material";

export default function IndividualCard({
  title,
  date,
  m_content1,
  m_content2,
  s_content1,
  s_content2,
  button,
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
          width: "100%",
          backgroundColor: "black",
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontSize: "15px" }}>
          {title}
        </Typography>

        <Typography variant="h5" sx={{ color: "white", fontSize: "15px" }}>
          {date}
        </Typography>
      </CardContent>

      {/* --------------------------------- Middle content----------------------------------------- */}
      <CardContent>
        <Grid container spacing={1}>
          {/* Column 1 */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography gutterBottom variant="h7">
              {m_content1}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {m_content2}
            </Typography>
          </Grid>

          {/* Column 2 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", color: "text.primary" }}
            >
              {true ? (s_content1 ? `⭐ : ${s_content1}` : "⭐ : ???") : ""}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", color: "text.primary" }}
            >
              {true ? (s_content2 ? `🔍 : ${s_content2}` : "🔍 : ???") : ""}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      {/* --------------------------------- Bottom Section----------------------------------------- */}
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button size="small">{true ? "Version" : "Patch"}</Button>

        <Button
          size="small"
          component="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Link
        </Button>
      </CardActions>
    </Card>
  );
}
