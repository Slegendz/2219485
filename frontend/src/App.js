import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container } from "@mui/material";
import UrlStats from "./components/UrlStats.jsx";
import UrlForm from "./components/UrlForm.jsx";

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Shortener</Button>
          <Button color="inherit" component={Link} to="/stats">Stats</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<UrlForm />} />
          <Route path="/stats" element={<UrlStats />} />
        </Routes>
      </Container>
    </Router>
  );
}
