import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { HashRouter, Routes, Route, Navigate } from "react-router";
import { createTheme, MantineProvider } from "@mantine/core";

import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import SignIn from "./Pages/SignIn/SignIn.jsx";
import SignUp from "./Pages/SignUp/SignUp.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Root from "./Pages/Root.jsx";

import AuthProvider from "./components/AuthProvider/AuthProvider.jsx";
import { getToken } from "./helpers";

import "./index.css";
import "@mantine/core/styles.css";

const theme = createTheme({
  /** Put your mantine theme override here */
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Root />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
              <Route
                path="profile"
                element={getToken() ? <Profile /> : <Navigate to="/signin" />}
              />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </MantineProvider>
  </StrictMode>
);
