import { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Box } from "@mui/material";

const UrlForm = () => {
  const [inputs, setInputs] = useState([
    { url: "", shortcode: "", validity: "" },
  ]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const addInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "", shortcode: "", validity: "" }]);
    }
  };

  const redirectUrl = async (e, shortcode) => {
    e.preventDefault();

    try {
      shortcode = shortcode.split("/")[3];

      const response = await fetch(`http://localhost:4000/api/${shortcode}`, {
        method: "GET",
      });

      const data = await response.json();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    const result = [];

    for (const input of inputs) {
      if (!input.url) {
        result.push({ error: "URL is required." });
        continue;
      }

      try {
        const response = await fetch("http://localhost:4000/api/shorturls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: input.url,
            shortcode: input.shortcode || "",
            validity: input.validity ? parseInt(input.validity) : "",
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          result.push({ error: data.error || "Unknown error" });
        } else {
          result.push(data);
        }
      } catch (err) {
        result.push({ error: "Network error" });
      }
    }

    setResults(result);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        URL Shortener
      </Typography>

      {inputs.map((input, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Long URL"
              value={input.url}
              onChange={(e) => handleChange(index, "url", e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Shortcode (optional)"
              value={input.shortcode}
              onChange={(e) => handleChange(index, "shortcode", e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Validity (min)"
              type="number"
              value={input.validity}
              onChange={(e) => handleChange(index, "validity", e.target.value)}
            />
          </Grid>
        </Grid>
      ))}

      <Box display="flex" gap={2} mb={2}>
        <Button
          variant="outlined"
          onClick={addInput}
          disabled={inputs.length >= 5}
        >
          Add More
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Shorten
        </Button>
      </Box>

      {results.length > 0 && (
        <Box>
          <Typography variant="h6">Results:</Typography>
          {results.map((res, i) =>
            res.shortLink ? (
              <Typography key={i}>
                <a
                  href={res.shortLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => redirectUrl(e, res.shortLink)}
                >
                  {res.shortLink}
                </a>
                <br />
                Expires: {new Date(res.expiry).toLocaleString()}
              </Typography>
            ) : (
              <Typography key={i} color="error">
                {res.error}
              </Typography>
            )
          )}
        </Box>
      )}
    </Paper>
  );
};

export default UrlForm;
