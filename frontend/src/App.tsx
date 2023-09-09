import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Redemption from "./pages/Redemption";

function App() {
    return (
        <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route path="/" element={<Redemption />} />
            </Routes>
        </Router>
        </ThemeProvider>
    );
}

const theme = createTheme({
    // typography: {
    //   fontFamily: 'Your-Selected-Font, sans-serif', // Replace 'Your-Selected-Font' with your font name
    // },

    palette: {
        primary: {
            light: "#FFFFFF",
            main: "#13C1F3",
            contrastText: "#FFFFFF",
        },
        secondary: {
            light: "#FFFFFF",
            main: "#1E9859",
            contrastText: "#FFFFFF",
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
  },
);

export default App;
