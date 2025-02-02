import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { HashRouter, Routes, Route, Navigate } from "react-router";
import { createTheme, MantineProvider } from "@mantine/core";

import HomePage from "./Pages/HomePage.jsx";
import AboutPage from "./Pages/AboutPage.jsx";
import SignInPage from "./Pages/SignInPage.jsx";
import SignUpPage from "./Pages/SignUpPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import NotificationPage from "./Pages/NotificationPage.jsx";
import Root from "./Pages/layout/Root.jsx";
import Layout from "./Pages/layout/Layout.jsx";
import VaultPage from "./Pages/VaultPage.jsx";
import RewardCalculatorPage from "./Pages/RewardCalculatorPage.jsx";
import OrganisationPage from "./Pages/OrganisationPage.jsx";

import AuthProvider from "./components/AuthProvider/AuthProvider.jsx";
import { getToken } from "./helpers";

import "./index.css";
import "@mantine/core/styles.css";

const theme = createTheme({
  fontFamily: "Poppins, sans-serif",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Root />}>
              {/* <Route index element={<HomePage />} /> */}
              <Route path="about" element={<AboutPage />} />
              <Route path="signin" element={<SignInPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="/" element={<Layout />}>
                <Route
                  index
                  path="/"
                  element={
                    <HomePage /> /* getToken() ? <Profile /> : <Navigate to="/signin" /> */
                  }
                />
                <Route
                  path="organisation"
                  element={
                    <OrganisationPage /> /* getToken() ? <Profile /> : <Navigate to="/signin" /> */
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <NotificationPage /> /* getToken() ? <Profile /> : <Navigate to="/signin" /> */
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProfilePage /> /* getToken() ? <Profile /> : <Navigate to="/signin" /> */
                  }
                />

                <Route
                  path="vault/:id"
                  element={
                    <VaultPage /> /* getToken() ? <Profile /> : <Navigate to="/signin" /> */
                  }
                />
                <Route
                  path="reward-calculator"
                  element={
                    <RewardCalculatorPage /> /* getToken() ? <Profile /> : <Navigate to="/signin" /> */
                  }
                />
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </MantineProvider>
  </StrictMode>
);
