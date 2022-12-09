import { useState } from "react";
import { useEffect } from "react";
// Material UI
import { ThemeProvider } from "@emotion/react";
import { Box, useMediaQuery } from "@mui/material";

import Axios from "axios";


// React Router
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";

// Modules
import ArtCardDetails from "./components/ArtCardDetails/ArtCardDetails";
import Layout from "./components/Layout/Layout";
import useCustomTheme from "./hooks/useCustomTheme";
import Auction from "./Pages/Auction/Auction";
import Intervention from "./Pages/Intervention/Intervention";
import Favourites from "./Pages/Favourites/Favourites";
import TrendingSellers from "./Pages/TrendingSellers/TrendingSellers";
import Home from "./Pages/Home/Home";
import SellersDetails from "./Pages/SellerDetails/SellersDetails";
import Footer from "./components/Footer/Footer";
import UserProfile from "./Pages/UserProfile/UserProfile";
import TrendingCreators from "./Pages/TrendingCreators/TrendingCreators";
import ProfileInterface from "./components/ProfileInterface/ProfileInterface";
import KYCInterface from "./components/KYCInterface/KYCInterface";
import LanguageInterface from "./components/LanguageInterface/LanguageInterface";
import ThemeInterface from "./components/ThemeInterface/ThemeInterface";
import EditProfile from "./components/ProfileInterface/EditProfile";
import KYCPending from "./components/KYCInterface/KYCPending";
import KYCApproved from "./components/KYCInterface/KYCApproved";
import TermsAndCondition from "./Pages/Terms&Condition/TermsAndCondition";
import FAQ from "./Pages/FAQ/FAQ";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import ContactUs from "./Pages/ContactUs/ContactUs";
import CreateAssets from "./Pages/CreateAssets/CreateAssets";
import CreateTier from "./Pages/CreateAssets/CreateTier";
import CreateCompany from "./Pages/CreateAssets/CreateCompany";
import DummyUserProfile from "./Pages/DummyUser/DummyUserProfile";
import AuctionCardDetails from "./components/AuctionCardDetails/AuctionCardDetails";
import CreatorsDetails from "./Pages/CreatorsDetails/CreatorsDetails";
import AnimatedLoader from "./Utils/AnimatedLoader/AnimatedLoader";
import AllTierCards from "./components/ArtCardContainer/AllTierCards";
import SelectTierCards from "./components/ArtCardContainer/SelectTierCards";
import SelectCompanyCards from "./components/ArtCardContainer/SelectCompanyCards";
import AllCompanyCards from "./components/ArtCardContainer/AllCompanyCards";
import ArtInterventionDetails from "./components/ArtInterventionDetails/ArtInterventionDetails";
import ArtTierDetails from "./components/ArtTierDetails/ArtTierDetails";
import Dashboard from "./Pages/Dashboard/Dashboard.js";
import BaseUrl from "./Utils/urls.js";

import { PrivateRoute } from "./components/PrivateRoute";
import LoginPage from "./Pages/Auth/Login";
import RegisterPage from "./Pages/Auth/Register";
import EditPage from "./Pages/Auth/Edit";

import "./App.css";
import 'react-notifications/lib/notifications.css';

Axios.defaults.baseURL = BaseUrl;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { customTheme } = useCustomTheme(darkMode);

  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const appLoader = setTimeout(() => setShowApp(true), 2000);
    return () => clearTimeout(appLoader);
  }, []);

  const isMobile = useMediaQuery("(max-width:966px)");

  const handleDarkThemeSwitch = () => {
    localStorage.setItem("theme", "dark");
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const handleLightThemeSwitch = () => {
    localStorage.setItem("theme", "light");
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem("user_wallet");
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    } else if (theme === "light") {
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    }
  }, [customTheme]);

  return (
    <ThemeProvider theme={customTheme}>
      <div
        style={{
          backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
          height: "100vh",
        }}
      >
        {showApp ? (
          <Box bgcolor={darkMode ? "#040404" : "#ffffff"}>
            <HashRouter>
              <Layout darkMode={darkMode}>
                <Routes>
                  <Route
                    path="/login"
                    element={<LoginPage darkMode={darkMode} />}
                  />
                  <Route
                    path="/register"
                    element={<RegisterPage darkMode={darkMode} />}
                  />
                  <Route
                    path="/edit"
                    element={<EditPage darkMode={darkMode} />}
                  />

                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Home darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/home"
                    element={
                      <PrivateRoute>
                        <Home darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Intervention"
                    element={
                      <PrivateRoute>
                        <Intervention darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/auction"
                    element={
                      <PrivateRoute>
                        <Auction darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Intervention/:interventionId"
                    element={
                      <PrivateRoute>
                        <AllTierCards darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Intervention/select/tiers"
                    element={
                      <PrivateRoute>
                        <SelectTierCards darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Intervention/select/companies"
                    element={
                      <PrivateRoute>
                        <SelectCompanyCards darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Intervention/details/:interventionId"
                    element={
                      <PrivateRoute>
                        <ArtInterventionDetails darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Intervention/:interventionId/details/:tierId"
                    element={
                      <PrivateRoute>
                        <ArtTierDetails darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Intervention/:interventionId/:tierId"
                    element={
                      <PrivateRoute>
                        <AllCompanyCards darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Intervention/select/details/:companyId"
                    element={
                      <PrivateRoute>
                        <ArtCardDetails darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Intervention/:interventionId/:tierId/:companyId"
                    element={
                      <PrivateRoute>
                        <ArtCardDetails darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/auction/:id"
                    element={<AuctionCardDetails darkMode={darkMode} />}
                  />
                  <Route
                    path="/favourites"
                    element={
                      <PrivateRoute>
                        <Favourites darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/trending-sellers"
                    element={
                      <PrivateRoute>
                        <TrendingSellers darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/trending-sellers/:id"
                    element={
                      <PrivateRoute>
                        <SellersDetails darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/user/dummy"
                    element={
                      <PrivateRoute>
                        <DummyUserProfile darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/create-asset"
                    element={
                      <PrivateRoute role="1">
                        <CreateAssets darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/:interventionId/create-tier"
                    element={
                      <PrivateRoute role="2">
                        <CreateTier darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/:interventionId/:tierId/create-company"
                    element={
                      <PrivateRoute>
                        <CreateCompany darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <UserProfile darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="user-profile"
                    element={
                      <PrivateRoute>
                        <ProfileInterface darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="edit-profile"
                    element={
                      <PrivateRoute>
                        <EditProfile darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="kyc"
                    element={
                      <PrivateRoute>
                        <KYCInterface darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="kyc-pending"
                    element={
                      <PrivateRoute>
                        <KYCPending darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="kyc-approved"
                    element={
                      <PrivateRoute>
                        <KYCApproved darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="language"
                    element={
                      <PrivateRoute>
                        <LanguageInterface darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="theme"
                    element={
                      <PrivateRoute>
                        <ThemeInterface
                          darkMode={darkMode}
                          setDarkMode={setDarkMode}
                          handleDarkThemeSwitch={handleDarkThemeSwitch}
                          handleLightThemeSwitch={handleLightThemeSwitch}
                        />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/trending-creators"
                    element={
                      <PrivateRoute>
                        <TrendingCreators darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/trending-creators/:id"
                    element={
                      <PrivateRoute>
                        <CreatorsDetails darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/privacy-policy"
                    element={
                      <PrivateRoute>
                        <PrivacyPolicy darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/terms-and-condition"
                    element={
                      <PrivateRoute>
                        <TermsAndCondition darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/frequently-asked-questions"
                    element={
                      <PrivateRoute>
                        <FAQ darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/contact-us"
                    element={
                      <PrivateRoute>
                        <ContactUs darkMode={darkMode} />
                      </PrivateRoute>
                    }
                  />
                </Routes>
                {/* {!isMobile && <Footer darkMode={darkMode} />} */}
              </Layout>
            </HashRouter>
          </Box>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <AnimatedLoader />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
