import { Stack, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ContactUsImage from "../../assets/contact-us-writing.svg";
import { GradientButtonPrimary } from "../../Utils/GradientButtons/GradientButtons";

// Icons
import { MdOutlineSaveAlt } from "react-icons/md";

import { useTheme } from "@emotion/react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ROLE } from "../../constants";
// import BaseUrl from "../../Utils/urls";

const Login = ({ darkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const Login_User = (e) => {
    e.preventDefault();

    // let valid = formValidation();
    // if(!valid) {
    //     return;
    // }
    async function userLogin() {
      await axios
        .post("/api/users/login", formData)
        // .post(BaseUrl + "/api/users/login", formData)
        .then((res) => {
          localStorage.setItem("user", res.data.user);
          console.log("compare:", res.data.user_role, ROLE.INVERTOR, localStorage.getItem("user")); 
          if (res.data.user_role == ROLE.INVERTOR) {
            // console.log("123");
            navigate("/dashboard");
          } else if (res.data.user_role == ROLE.TIER) {
            console.log("345");
            navigate("/Intervention/select/tiers");
          } else if (res.data.user_role == ROLE.COMPANY) {
            console.log("111");
            navigate("/Intervention/select/companies");
          }
        })
        .catch((error) => {
          alert("User Not Found.");
        });
    }
    userLogin();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {!isMobile ? (
        <div>
          <Box
            color={darkMode ? "#ffffff" : "#121212"}
            sx={{
              position: "relative",
              display: "flex",
              gap: 4,
              alignItems: "center",
              mt: 11,
              mb: 5,
            }}
          >
            <Typography
              component="div"
              sx={{
                borderBottom: `2px solid ${darkMode ? "#ffffff" : "#121212"}`,
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                // onClick={() => navigate("/Intervention?type=all")}
                variant="h6"
                component="p"
                sx={{ zIndex: 2, cursor: "pointer" }}
              >
                {t("USER_LOGIN")}
              </Typography>
            </Typography>
          </Box>
          <Box
            bgcolor={darkMode ? "#171c26" : "#fff2f8"}
            sx={{
              px: 5,
              py: 5,
              borderRadius: "16px",
              width: "600px",
            }}
          >
            <Box
              bgcolor={darkMode ? "#040404" : "#ffffff"}
              sx={{
                p: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "16px",
              }}
            >
              <Box component="form" sx={{ width: "100%" }}>
                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="userEmail"
                  >
                    {t("USER_EMAIL")}
                  </label>
                  <input
                    className={darkMode && "inputField"}
                    type="email"
                    placeholder="Enter your email here"
                    name="userEmail"
                    onChange={onChange}
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="userPassword"
                  >
                    {t("USER_PASSWORD")}
                  </label>

                  <input
                    className={darkMode && "inputField"}
                    placeholder="Enter your password"
                    onChange={onChange}
                    name="userPassword"
                    type="password"
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                </Stack>

                <Stack alignItems="flex-end" spacing={2}>
                  <GradientButtonPrimary
                    type="submit"
                    onClick={(e) => Login_User(e)}
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <Typography component="span" color="#ffffff">
                      <MdOutlineSaveAlt />
                    </Typography>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        textTransform: "capitalize",
                        color: "#ffffff",
                      }}
                    >
                      {t("SUBMIT")}
                    </Typography>
                  </GradientButtonPrimary>
                </Stack>
                {/* <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <p
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    {t("HAVE_REGISTER")}
                    <Link
                      style={{
                        color: `${darkMode ? "#ffffff" : "#040404"}`,
                        fontSize: "15px",
                        fontStyle: "italic",
                        textDecoration: "underline",
                      }}
                      to="/register"
                    >
                      {t("REGISTER_HERE")}
                    </Link>
                  </p>
                </Stack> */}
              </Box>
            </Box>
          </Box>
        </div>
      ) : (
        <div style={{ marginBottom: "2.5rem" }}>
          <Box
            sx={{
              position: "fixed",
              top: "3%",
              zIndex: "10000",
              left: "40%",
            }}
          >
            <Typography
              variant="subtitle1"
              color="secondary"
              component="div"
              sx={{
                borderBottom: `${
                  darkMode ? "2px solid #ffffff" : "1px solid #171c26"
                }`,
              }}
            >
              {t("USER_LOGIN")}
            </Typography>
          </Box>
          <Box sx={{ mt: 5 }}>
            <Box
              bgcolor={darkMode ? "#040404" : "#ffffff"}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "16px",
              }}
            >
              <Box component="form" width={"100%"}>
                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="userEmail"
                  >
                    {t("USER_EMAIL")}
                  </label>
                  <input
                    className={darkMode && "inputField"}
                    type="email"
                    placeholder="Enter your email here"
                    name="userEmail"
                    onChange={onChange}
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="messageSubject"
                  >
                    {t("USER_PASSWORD")}
                  </label>

                  <input
                    className={darkMode && "inputField"}
                    placeholder="Enter your password here"
                    name="userPassword"
                    onChange={onChange}
                    type="password"
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    ml: 6,
                  }}
                >
                  <GradientButtonPrimary
                    type="submit"
                    onClick={(e) => Login_User(e)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <Typography component="span" color="#ffffff">
                      <MdOutlineSaveAlt />
                    </Typography>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        textTransform: "capitalize",
                        color: "#ffffff",
                      }}
                    >
                      {t("SUBMIT")}
                    </Typography>
                  </GradientButtonPrimary>
                </Box>
                {/* <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <p
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    {t("HAVE_REGISTER")}
                    <Link
                      style={{
                        color: `${darkMode ? "#ffffff" : "#040404"}`,
                        fontSize: "15px",
                        fontStyle: "italic",
                        textDecoration: "underline",
                      }}
                      to="/register"
                    >
                      {t("REGISTER_HERE")}
                    </Link>
                  </p>
                </Stack> */}
              </Box>
            </Box>
          </Box>
        </div>
      )}
    </>
  );
};

export default Login;
