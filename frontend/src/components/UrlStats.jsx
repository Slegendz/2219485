import { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";

const UrlStats = () => {
  const [shortcode, setShortcode] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/shorturls/${shortcode}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setStats(null);
        setError(data.error || "Not found");
      } else {
        setStats(data);
        setError("");
      }
    } catch {
      setStats(null);
      setError("Network error");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>

      <Box display="flex" gap={2} mt={2} mb={2}>
        <TextField
          label="Enter Shortcode"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <Button variant="contained" onClick={fetchStats}>
          Get Stats
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {stats && (
        <Box>
          <Typography> Original URL: {stats.originalUrl}</Typography>
          <Typography>
            {" "}
            Short Link: <a href={stats.shortLink}>{stats.shortLink}</a>
          </Typography>
          <Typography>
            {" "}
            Expires: {new Date(stats.expiry).toLocaleString()}
          </Typography>
          <Typography> Clicks: {stats.clicks}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default UrlStats;
