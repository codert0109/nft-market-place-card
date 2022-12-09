import { Stack, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {NotificationContainer, NotificationManager} from 'react-notifications';

import ContactUsImage from "../../assets/contact-us-writing.svg";
import { GradientButtonPrimary } from "../../Utils/GradientButtons/GradientButtons";

// Icons
import { MdOutlineSaveAlt } from "react-icons/md";

import { useTheme } from "@emotion/react";

import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import BaseUrl from "../../Utils/urls";
import * as emailjs from "emailjs-com";

const Register = ({ darkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userRole: 1,
    userPasswordConform: "",
  });

  const [formError, setFormError] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userRole: "",
    userPasswordConform: "",
  });

  const formValidation = () => {
    let validate = true;
    let name_error = "";
    let email_eror = "";
    let pass_error = "";
    let pass_conform_error = "";
    let role_error = "";
    if (formData.userName == "") {
      name_error = "User name is required.";
      validate = false;
    }

    let emailValid = formData.userEmail.match(
      /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
    );

    if (!emailValid) {
      email_eror = "User email is invalid.";
      validate = false;
    }
    if (formData.userEmail == "") {
      email_eror = "User email is required.";
      validate = false;
    }

    if (formData.userPassword.length < 6) {
      pass_error = "Password must be longer than 6 characters.";
      validate = false;
    }
    if (formData.userPassword == "") {
      pass_error = "User password is required.";
      validate = false;
    }
    if (formData.userPasswordConform != formData.userPassword) {
      pass_conform_error = "Conform password is invalid.";
      validate = false;
    }
    if (formData.userRole == 0) {
      role_error = "Please select role.";
      validate = false;
    }
    setFormError({
      ...formError,
      userRole: role_error,
      userName: name_error,
      userEmail: email_eror,
      userPassword: pass_error,
      userPasswordConform: pass_conform_error,
    });

    return validate;
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const Register_User = (e) => {
    e.preventDefault();

    let valid = formValidation();
    if (!valid) {
      return;
    }
    async function userRegister() {
      await axios
        .post("/api/users/register", formData)
        // .post(BaseUrl + "/api/users/register", formData)
        .then(async (res) => {
          if (res.data.resp == "success") {
            const serviceID = "default_service";
            const templateID = "template_oxn30x4";
            var template_params = {
              name: formData.userName,
              email: formData.userEmail,
              password: formData.userPassword,
            };
            await emailjs.init("UUuu_0_sEYamVnR-B");

            // await emailjs.send(serviceID, templateID, template_params).then(
            //   () => {
            //     alert("Sent!");
            //   },
            //   (err) => {
            //     alert(JSON.stringify(err));
            //   }
            // );
            // alert("User successfully created");
            NotificationManager.success('Success message', 'Title here');
            navigate("/dashboard");
          } else {
            alert("User email already exists.");
          }
        })
        .catch((error) => {
          alert(error.response.data.resp);
        });
    }
    userRegister();
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
                {t("USER_REGISTER")}
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
                    htmlFor="userName"
                  >
                    {t("USER_NAME")}
                  </label>
                  <input
                    className={darkMode && "inputField"}
                    type="text"
                    placeholder="Enter your name here"
                    name="userName"
                    onChange={onChange}
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userName}
                  </span>
                </Stack>
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
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userEmail}
                  </span>
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
                    placeholder="Enter user password"
                    name="userPassword"
                    type="password"
                    onChange={onChange}
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userPassword}
                  </span>
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="userPasswordConform"
                  >
                    {t("USER_PASSWORD_CONFORM")}
                  </label>

                  <input
                    className={darkMode && "inputField"}
                    placeholder="Enter message subject here"
                    name="userPasswordConform"
                    type="password"
                    onChange={onChange}
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userPasswordConform}
                  </span>
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="userRole"
                  >
                    {t("USER_ROLE")}
                  </label>
                  <select
                    className={darkMode && "inputField"}
                    name="userRole"
                    onChange={onChange}
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  >
                    <option value="0"></option>
                    <option value="1">Investor</option>
                  </select>
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userRole}
                  </span>
                </Stack>
                <Stack alignItems="flex-end" spacing={2}>
                  <GradientButtonPrimary
                    type="submit"
                    onClick={(e) => Register_User(e)}
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
                    {t("HAVE_ACCOUNT")}
                    <Link
                      style={{
                        color: `${darkMode ? "#ffffff" : "#040404"}`,
                        fontSize: "15px",
                        fontStyle: "italic",
                        textDecoration: "underline",
                      }}
                      to="/dashboard"
                    >
                      {t("LOGIN_HERE")}
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
              top: "0%",
              zIndex: "10000",
              display: "flex",
              backgroundColor: "black",
              padding: "15px 0px",
              width: "100%",
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
              {t("USER_REGISTER")}
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
                    htmlFor="userName"
                  >
                    {t("USER_NAME")}
                  </label>
                  <input
                    className={darkMode && "inputField"}
                    type="text"
                    placeholder="Enter your name here"
                    name="userName"
                    onChange={onChange}
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userName}
                  </span>
                </Stack>
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
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userEmail}
                  </span>
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
                    placeholder="Enter password"
                    name="userPassword"
                    onChange={onChange}
                    type="password"
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userPassword}
                  </span>
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="userPasswordConform"
                  >
                    {t("USER_PASSWORD_CONFORM")}
                  </label>

                  <input
                    className={darkMode && "inputField"}
                    placeholder="Conform Password"
                    name="userPasswordConform"
                    type="password"
                    onChange={onChange}
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userPasswordConform}
                  </span>
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="userMessage"
                  >
                    {t("USER_ROLE")}
                  </label>
                  <select
                    className={darkMode && "inputField"}
                    name="userRole"
                    // onChange={onChange}
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#040404"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  >
                    {/* <option value="0"></option> */}
                    <option value="1">Investor</option>
                    {/* <option value="2">Tier</option>
                                        <option value="3">Company</option> */}
                  </select>
                  <span
                    className="error"
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginTop: "0px",
                    }}
                  >
                    {formError.userRole}
                  </span>
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
                    onClick={(e) => Register_User(e)}
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
                {/* <Stack
                                    direction="column"
                                    spacing={2}
                                    sx={{ mb: 3 }}
                                >
                                    <p
                                        style={{
                                            color: `${
                                                darkMode ? "#ffffff" : "#040404"
                                            }`,
                                            fontSize: "14px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {t("HAVE_ACCOUNT")}
                                        <Link
                                            style={{
                                                color: `${
                                                    darkMode
                                                        ? "#ffffff"
                                                        : "#040404"
                                                }`,
                                                fontSize: "15px",
                                                fontStyle: "italic",
                                                textDecoration: "underline",
                                            }}
                                            to="/login"
                                        >
                                            {t("LOGIN_HERE")}
                                        </Link>
                                    </p>
                                </Stack> */}
              </Box>
            </Box>
          </Box>
        </div>
      )}
      <NotificationContainer />
    </>
  );
};

export default Register;
