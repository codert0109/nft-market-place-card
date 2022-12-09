import {
    Button,
    Grid,
    IconButton,
    Stack,
    Typography,
    useMediaQuery,
  } from "@mui/material";
  import { useTheme } from "@emotion/react";
  
  import { Box } from "@mui/system";
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { styled } from "@mui/material/styles";
  import AdapterDateFns from "@mui/lab/AdapterDateFns";
  
  // Icons
  import { TiTimes } from "react-icons/ti";
  import { MdAddToPhotos } from "react-icons/md";
  import { RiAddBoxFill } from "react-icons/ri";
  import { ImImage } from "react-icons/im";
  import { BiMenuAltLeft } from "react-icons/bi";
  import { FaWallet } from "react-icons/fa";
  
  import {
    GradientButtonPrimary,
    GradientButtonSecondary,
  } from "../../Utils/GradientButtons/GradientButtons";
  import AssetProperModal from "../../components/AssetPropertiesModal/AssetProperModal";
  
  import { useTranslation } from "react-i18next";
  import { LocalizationProvider, MobileDatePicker } from "@mui/lab";
  import AssetProperModalMobile from "../../components/AssetPropertiesModal/AssetProperModalMobile";
  import { useParams } from "react-router-dom";
  import { useNavigate, useLocation } from "react-router-dom";
  import { ethers } from "ethers";
  // import BaseUrl from "../../Utils/urls";
  import * as emailjs from "emailjs-com";
  
  const Input = styled("input")({
    display: "none",
  });
  
  // const propertiesData = { id: Math.random(), color: "black" };
  
  const CreateAssets = ({ darkMode }) => {
    const [image, setImage] = useState(null);
    const wallet = ethers.Wallet.createRandom();
    const navigate = useNavigate();
    const { interventionId, tierId } = useParams();
    const [formData, setFormData] = useState({
      company_name: "",
      company_description: "",
      company_image: {},
      tier_id: tierId,
      company_token_amount: 0,
      company_is_claim: false,
      company_wallet_address: wallet.address,
      company_private_key: wallet.privateKey,
      user_name: "",
      user_password: "",
      user_email: "",
    });
    const [formError, setFormError] = useState({
      company_name: "",
      company_description: "",
      user_name: "",
      user_password: "",
      user_email: "",
    });
    const { t } = useTranslation();
  
    const [openButtonToggler, setOpenButtonToggler] = useState(false);
    const [openModal, setOpenModal] = useState(false);
  
    const [dateValueFrom, setDateValueFrom] = useState(new Date());
    const [dateValueTo, setDateValueTo] = useState(new Date());
  
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
    const [propertiesDataState, setPropertiesDataState] = useState([
      { key: "", value: "" },
    ]);
  
    const [savedProperties, setSavedProperties] = useState([]);
  
    const formValidation = () => {
      let validate = true;
      let company_name_error = "";
      let company_description_error = "";
      let user_name_error = "";
      let user_password_error = "";
      let user_email_error = "";
      if (formData.company_name == "") {
        company_name_error = "Company name is required.";
        validate = false;
      }
      if (formData.company_description == "") {
        company_description_error = "Company description is required.";
        validate = false;
      }
      if (formData.user_name == "") {
        user_name_error = "User name is required.";
        validate = false;
      }
      if (formData.user_password == "") {
        user_password_error = "User password is required.";
        validate = false;
      }
      let emailValid = formData.user_email.match(
        /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
      );
      if (!emailValid) {
        user_email_error = "User email is invalid.";
        validate = false;
      }
      if (formData.user_email == "") {
        user_email_error = "User email is required.";
        validate = false;
      }
      setFormError({
        ...formError,
        company_name: company_name_error,
        company_description: company_description_error,
        user_name: user_name_error,
        user_password: user_password_error,
        user_email: user_email_error,
      });
  
      return validate;
    };
  
    const handlePropertiesChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...propertiesDataState];
      list[index][name] = value;
      setPropertiesDataState(list);
    };
  
    const handlePropertiesRemove = (id) => {
      const filteredRemaining = propertiesDataState.filter(
        (pds) => pds.id !== id
      );
      setPropertiesDataState(filteredRemaining);
    };
  
    const handlePropertiesAdd = () => {
      setPropertiesDataState([
        ...propertiesDataState,
        { key: "", value: "", id: Math.random() },
      ]);
    };
  
    const handleSavePropeties = () => {
      setSavedProperties([...propertiesDataState]);
      setOpenModal(false);
    };
  
    const handleOpenModal = () => {
      setOpenModal(true);
    };
  
    const handleCloseModal = () => {
      setOpenModal(false);
    };
  
    const handleImageUpload = (e) => {
      setImage(URL.createObjectURL(e.target.files[0]));
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };
    const onChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const Create_company = (e) => {
      e.preventDefault();
      let valid = formValidation();
      if (!valid) {
        return;
      }
      const fd = new FormData();
      fd.append("company_name", formData.company_name);
      fd.append("company_description", formData.company_description);
      fd.append("company_image", formData.company_image);
      fd.append("tier_id", formData.tier_id);
      fd.append("company_token_amount", formData.company_token_amount);
      fd.append("company_is_claim", formData.company_is_claim);
      fd.append("company_wallet_address", formData.company_wallet_address);
      fd.append("company_private_key", formData.company_private_key);
      fd.append("user_name", formData.user_name);
      fd.append("user_password", formData.user_password);
      fd.append("user_email", formData.user_email);
  
      async function fetchData() {
        await axios
          .post("/api/company/create", fd)
          // .post(BaseUrl + "/api/company/create", fd)
          .then(async (res) => {
            const serviceID = "default_service";
            const templateID = "template_oxn30x4";
            var template_params = {
              name: formData.user_name,
              email: formData.user_email,
              password: formData.user_password,
            };
            await emailjs.init("UUuu_0_sEYamVnR-B");
  
            await emailjs.send(serviceID, templateID, template_params).then(
              () => {
                alert("Email is sent!");
              },
              (err) => {
                alert(JSON.stringify(err));
              }
            );
            //   alert("success");
            navigate(`/intervention/${interventionId}/${tierId}`);
          })
          .catch((error) => {
            alert(error.response.data.resp);
          });
      }
      fetchData();
    };
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
    return (
      <>
        <Box>
          {!isMobile ? (
            <AssetProperModal
              handlePropertiesChange={handlePropertiesChange}
              darkMode={darkMode}
              propertiesDataState={propertiesDataState}
              savedProperties={savedProperties}
              handlePropertiesAdd={handlePropertiesAdd}
              openModal={openModal}
              handleCloseModal={handleCloseModal}
              handlePropertiesRemove={handlePropertiesRemove}
              handleSavePropeties={handleSavePropeties}
            />
          ) : (
            <AssetProperModalMobile
              handlePropertiesChange={handlePropertiesChange}
              darkMode={darkMode}
              propertiesDataState={propertiesDataState}
              savedProperties={savedProperties}
              handlePropertiesAdd={handlePropertiesAdd}
              openModal={openModal}
              handleCloseModal={handleCloseModal}
              handlePropertiesRemove={handlePropertiesRemove}
              handleSavePropeties={handleSavePropeties}
            />
          )}
        </Box>
        {!isMobile ? (
          <Box zIndex={1000}>
            <Box sx={{ mt: 10.5, mb: 4 }}>
              <Typography
                component="div"
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  component="span"
                  color="secondary"
                  fontSize={20}
                  mt={1}
                >
                  <MdAddToPhotos />
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  color="secondary"
                  sx={{
                    zIndex: 2,
                    cursor: "pointer",
                    borderBottom: `2px solid ${darkMode ? "#ffffff" : "#171c26"}`,
                  }}
                >
                  {t("ADD_COMPANY")}
                </Typography>
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: `${darkMode ? "#171C26" : "#ffffff"}`,
                pr: 6,
                pl: 4,
                py: 4,
                borderRadius: "16px",
              }}
            >
              <Box component="form" sx={{ mt: 5 }}>
                <Grid
                  zIndex={1000}
                  container
                  columns={{ md: 12 }}
                  spacing={{ md: 15 }}
                >
                  <Grid item md={6}>
                    <Box>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="company_name"
                        >
                          {t("COMPANY_NAME")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_ENTER_COMPANY_NAME_HERE"
                          )}
                          name="company_name"
                          onChange={onChange}
                          required
                          style={{
                            fontSize: "14px",
                            border: "1px solid #c4c4c4",
                            borderRadius: "6px",
                            padding: "1rem 1.5rem",
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            backgroundColor: `${
                              darkMode ? "#171c26" : "#ffffff"
                            }`,
                            width: "90%",
                            zIndex: 1000,
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
                          {formError.company_name}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="company_description"
                        >
                          {t("DESCRIPTION")} *
                        </label>
                        <textarea
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_PROVIDE_A_DETAILED_DESCRIPTION_OF_THE_ITEM"
                          )}
                          name="company_description"
                          onChange={onChange}
                          required
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            border: "1px solid #c4c4c4",
                            borderRadius: "6px",
                            padding: "1rem 1.5rem",
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            backgroundColor: `${
                              darkMode ? "#171c26" : "#ffffff"
                            }`,
                            width: "90%",
                            row: 5,
                            resize: "vertical",
                            zIndex: 1000,
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
                          {formError.company_description}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="user_name"
                        >
                          {t("USER_NAME")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_ENTER_COMPANY_USER_NAME_HERE"
                          )}
                          name="user_name"
                          onChange={onChange}
                          required
                          style={{
                            fontSize: "14px",
                            border: "1px solid #c4c4c4",
                            borderRadius: "6px",
                            padding: "1rem 1.5rem",
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            backgroundColor: `${
                              darkMode ? "#171c26" : "#ffffff"
                            }`,
                            width: "90%",
                            zIndex: 1000,
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
                          {formError.user_name}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="user_password"
                        >
                          {t("USER_PASSWORD")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="password"
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_ENTER_COMPANY_USER_PASSWORD_HERE"
                          )}
                          name="user_password"
                          onChange={onChange}
                          required
                          style={{
                            fontSize: "14px",
                            border: "1px solid #c4c4c4",
                            borderRadius: "6px",
                            padding: "1rem 1.5rem",
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            backgroundColor: `${
                              darkMode ? "#171c26" : "#ffffff"
                            }`,
                            width: "90%",
                            zIndex: 1000,
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
                          {formError.user_password}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="user_email"
                        >
                          {t("USER_EMAIL")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="email"
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_ENTER_COMPANY_USER_EMAIL_HERE"
                          )}
                          name="user_email"
                          onChange={onChange}
                          required
                          style={{
                            fontSize: "14px",
                            border: "1px solid #c4c4c4",
                            borderRadius: "6px",
                            padding: "1rem 1.5rem",
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            backgroundColor: `${
                              darkMode ? "#171c26" : "#ffffff"
                            }`,
                            width: "90%",
                            zIndex: 1000,
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
                          {formError.user_email}
                        </span>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item md={6}>
                    <Box>
                      <Typography
                        color="secondary"
                        variant="body2"
                        component="p"
                        fontWeight={500}
                      >
                        {t("UPLOAD_IMAGE(PNG,JPEG/SVG)")}
                      </Typography>
                      <Box>
                        <Box>
                          {!image ? (
                            <Box
                              sx={{
                                my: 2,
                                width: "60%",
                                height: "150px",
                                border: "1px solid #c4c4c4",
                                borderStyle: "dashed",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "4px",
                                p: 3,
                              }}
                            >
                              <label htmlFor="icon-button-file-front">
                                <Input
                                  accept="image/*"
                                  id="icon-button-file-front"
                                  type="file"
                                  name="company_image"
                                  onChange={handleImageUpload}
                                />
                                <IconButton
                                  color="primary"
                                  aria-label="upload picture"
                                  component="span"
                                >
                                  <Typography
                                    component="span"
                                    color="secondary"
                                    fontSize={30}
                                  >
                                    <ImImage />
                                  </Typography>
                                </IconButton>
                              </label>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                my: 2,
                                position: "relative",
                              }}
                            >
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: "1%",
                                  top: "4%",
                                }}
                              >
                                <IconButton
                                  sx={{
                                    backgroundColor: `${
                                      darkMode ? "#fff2f8" : "#171c26"
                                    }`,
                                  }}
                                  onClick={() => setImage(null)}
                                >
                                  <TiTimes
                                    fontSize={"1rem"}
                                    color={darkMode ? "#171c26" : "#ffffff"}
                                  />
                                </IconButton>
                              </Box>
                              <Box
                                sx={{
                                  border: "1px solid #c4c4c4",
                                  borderStyle: "dashed",
                                  padding: "5px",
                                  width: "315px",
                                  height: "200px",
                                }}
                              >
                                <img
                                  style={{
                                    height: "200px",
                                    width: "315px",
                                  }}
                                  src={image}
                                  alt="Uploaded"
                                />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
  
                <Box
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginRight: "2.8rem",
                  }}
                >
                  <GradientButtonPrimary
                    type="submit"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 5,
                    }}
                    onClick={(e) => Create_company(e)}
                  >
                    <Typography component="span" color="#ffffff">
                      <MdAddToPhotos />
                    </Typography>
                    <Typography variant="body2" component="span">
                      {t("ADD_COMPANY")}
                    </Typography>
                  </GradientButtonPrimary>
                  <GradientButtonSecondary
                    type="button"
                    onClick={() => window.history.back()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 5,
                    }}
                  >
                    <Typography color="#ffffff" component="span">
                      <FaWallet />
                    </Typography>
                    <Typography variant="subtitle1" component="span">
                      {t("CANCEL")}
                    </Typography>
                  </GradientButtonSecondary>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "fixed",
                  top: "0%",
                  left: "44%",
                  transform: "translate(-50%, -50%)",
                  zIndex: "10000",
                  mt: 6,
                }}
              >
                <Box
                  pb={2}
                  ml={7}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                >
                  <Typography variant="subtitle1" color="secondary" mt={1.2}>
                    <MdAddToPhotos fontSize={20} />
                  </Typography>
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
                    {t("ADD_COMPANY")}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                mt: 1,
                // backgroundColor: `${darkMode ? "#171C26" : "#fff2f8"}`,
                py: 2,
                borderRadius: "16px",
              }}
            >
              <Box component="form">
                <Typography
                  color="secondary"
                  sx={{ mt: 5 }}
                  variant="body2"
                  component="p"
                >
                  {t("UPLOAD_IMAGE(PNG,JPEG/SVG)")}
                </Typography>
                <Box>
                  {!image ? (
                    <Box
                      sx={{
                        my: 2,
                        border: "1px solid #c4c4c4",
                        borderStyle: "dashed",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        p: 5,
                      }}
                    >
                      <label htmlFor="icon-button-file-front">
                        <Input
                          accept="image/*"
                          id="icon-button-file-front"
                          type="file"
                          name="company_image"
                          onChange={handleImageUpload}
                        />
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          <Typography component="span" color="secondary">
                            <ImImage />
                          </Typography>
                        </IconButton>
                      </label>
                    </Box>
                  ) : (
                    <Box sx={{ my: 2, position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: "1%",
                          top: "4%",
                        }}
                      >
                        <IconButton
                          sx={{
                            backgroundColor: `${
                              darkMode ? "#fff2f8" : "#171c26"
                            }`,
                          }}
                          onClick={() => setImage(null)}
                        >
                          <Typography component="span" color="secondary">
                            <TiTimes />
                          </Typography>
                        </IconButton>
                      </Box>
                      <img
                        style={{
                          border: "1px solid #c4c4c4",
                          borderStyle: "dashed",
                          width: "97%",
                          height: "136px",
                          padding: "5px",
                        }}
                        src={image}
                        alt="Uploaded"
                      />
                    </Box>
                  )}
                </Box>
                <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="company_name"
                  >
                    {t("COMPANY_NAME")} *
                  </label>
                  <input
                    className={darkMode ? "inputFieldMobile" : null}
                    type="text"
                    placeholder={t(
                      "CREATE_ASSET_PLACEHOLDER_ENTER_COMPANY_NAME_HERE"
                    )}
                    name="company_name"
                    onChange={onChange}
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="company_description"
                  >
                    {t("DESCRIPTION")} *
                  </label>
                  <textarea
                    placeholder={t(
                      "CREATE_ASSET_PLACEHOLDER_PROVIDE_A_DETAILED_DESCRIPTION_OF_THE_ITEM"
                    )}
                    name="company_description"
                    onChange={onChange}
                    required
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                      row: 5,
                      resize: "vertical",
                    }}
                  />
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="user_name"
                  >
                    {t("USER_NAME")} *
                  </label>
                  <input
                    className={darkMode ? "inputFieldMobile" : null}
                    type="text"
                    placeholder={t(
                      "CREATE_ASSET_PLACEHOLDER_ENTER_COMPANY_USER_NAME_HERE"
                    )}
                    name="user_name"
                    onChange={onChange}
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="user_password"
                  >
                    {t("USER_PASSWORD")} *
                  </label>
                  <input
                    className={darkMode ? "inputFieldMobile" : null}
                    type="password"
                    placeholder={t(
                      "CREATE_ASSET_PLACEHOLDER_ENTER_COMPANY_USER_PASSWORD_HERE"
                    )}
                    name="user_password"
                    onChange={onChange}
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      fontSize: "14px",
                    }}
                    htmlFor="user_email"
                  >
                    {t("USER_EMAIL")} *
                  </label>
                  <input
                    className={darkMode ? "inputFieldMobile" : null}
                    type="email"
                    placeholder={t(
                      "CREATE_ASSET_PLACEHOLDER_ENTER_COMPANY_USER_EMAIL_HERE"
                    )}
                    name="user_email"
                    onChange={onChange}
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
                    }}
                  />
                </Stack>
                <GradientButtonPrimary
                  type="submit"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 5,
                  }}
                  onClick={(e) => Create_company(e)}
                >
                  <Typography component="span" color="secondary">
                    <MdAddToPhotos />
                  </Typography>
                  <Typography variant="body2" component="span">
                    {t("ADD_COMPANY")}
                  </Typography>
                </GradientButtonPrimary>
                <GradientButtonPrimary
                  onClick={() => window.history.back()}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography color="#ffffff" component="span" mt={0.8}>
                    <MdAddToPhotos />
                  </Typography>
                  <Typography variant="subtitle1" component="span">
                    {t("CANCEL")}
                  </Typography>
                </GradientButtonPrimary>
              </Box>
            </Box>
          </Box>
        )}
      </>
    );
  };
  
  export default CreateAssets;
  