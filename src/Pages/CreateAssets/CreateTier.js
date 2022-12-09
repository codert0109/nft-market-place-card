import {
    Button,
    Grid,
    IconButton,
    Stack,
    Typography,
    useMediaQuery,
    Modal,
    Backdrop,
    Fade,
  } from "@mui/material";
  import { HiTemplate } from "react-icons/hi";
  import { BiUpArrowCircle } from "react-icons/bi";
  
  // Gradient buttons
  import { GradientButtonSecondary } from "../../Utils/GradientButtons/GradientButtons";
  import styles from "./createAssets.module.css";
  import { FaWallet } from "react-icons/fa";
  
  import { useTheme } from "@emotion/react";
  import axios from "axios";
  import { Box } from "@mui/system";
  import React, { useEffect, useState } from "react";
  
  import { styled } from "@mui/material/styles";
  import AdapterDateFns from "@mui/lab/AdapterDateFns";
  
  // Icons
  import { TiTimes } from "react-icons/ti";
  import { MdAddToPhotos } from "react-icons/md";
  import { RiAddBoxFill } from "react-icons/ri";
  import { ImImage } from "react-icons/im";
  import { BiMenuAltLeft } from "react-icons/bi";
  
  import { GradientButtonPrimary } from "../../Utils/GradientButtons/GradientButtons";
  import AssetProperModal from "../../components/AssetPropertiesModal/AssetProperModal";
  
  import { useTranslation } from "react-i18next";
  import { LocalizationProvider, MobileDatePicker } from "@mui/lab";
  import AssetProperModalMobile from "../../components/AssetPropertiesModal/AssetProperModalMobile";
  import { useParams } from "react-router-dom";
  import { useNavigate, useLocation } from "react-router-dom";
  import { ethers } from "ethers";
  import BaseUrl from "../../Utils/urls";
  import * as emailjs from "emailjs-com";
  
  const Input = styled("input")({
    display: "none",
  });
  
  // const propertiesData = { id: Math.random(), color: "black" };
  
  export const getContract = async () => {
    const tokenAddress = "0x7A6cdFF618DA6BAe64E47146102E4CeAff1286Eb";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
  
    const contractABI = require("./token.json");
    const tokenContract = new ethers.Contract(tokenAddress, contractABI, signer);
    return tokenContract;
  };
  
  const CreateAssets = ({ darkMode }) => {
    const wallet = ethers.Wallet.createRandom();
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const { interventionId } = useParams();
    const [formData, setFormData] = useState({
      tier_name: "",
      tier_description: "",
      tier_image: {},
      intervention_id: interventionId,
      tier_is_claim: false,
      tier_wallet_address: wallet.address,
      tier_private_key: wallet.privateKey,
      user_name: "",
      user_password: "",
      user_email: "",
    });
    const [formError, setFormError] = useState({
      tier_name: "",
      tier_description: "",
      user_name: "",
      user_password: "",
      user_email: "",
    });
    const { t } = useTranslation();
  
    const [openButtonToggler, setOpenButtonToggler] = useState(false);
    const [openModal, setOpenModal] = useState(false);
  
    const [dateValueFrom, setDateValueFrom] = useState(new Date());
    const [dateValueTo, setDateValueTo] = useState(new Date());
    const [openResultModal, setOpenResultModal] = React.useState(false);
  
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
    const [propertiesDataState, setPropertiesDataState] = useState([
      { key: "", value: "" },
    ]);
  
    const [savedProperties, setSavedProperties] = useState([]);
    const [intervention, setIntervention] = useState([]);
  
    const formValidation = () => {
      let validate = true;
      let tier_name_error = "";
      let tier_description_error = "";
      let user_name_error = "";
      let user_password_error = "";
      let user_email_error = "";
      if (formData.tier_name == "") {
        tier_name_error = "Tier name is required.";
        validate = false;
      }
      if (formData.tier_description == "") {
        tier_description_error = "Tier description is required.";
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
        tier_name: tier_name_error,
        tier_description: tier_description_error,
        user_name: user_name_error,
        user_password: user_password_error,
        user_email: user_email_error,
      });
  
      return validate;
    };
    const handleOpenResultModal = () => setOpenResultModal(true);
    const handleCloseResultModal = () => {
      setOpenResultModal(false);
      navigate(`/intervention/${interventionId}`);
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
    const Create_tier = (e) => {
      // console.log(formData);
      if (localStorage.getItem("user_wallet")) {
        e.preventDefault();
        let valid = formValidation();
        if (!valid) {
          return;
        }
        const fd = new FormData();
        fd.append("tier_name", formData.tier_name);
        fd.append("tier_description", formData.tier_description);
        fd.append("tier_image", formData.tier_image);
        fd.append("intervention_id", formData.intervention_id);
        fd.append("tier_is_claim", formData.tier_is_claim);
        fd.append("tier_wallet_address", formData.tier_wallet_address);
        fd.append("tier_private_key", formData.tier_private_key);
        fd.append("user_name", formData.user_name);
        fd.append("user_password", formData.user_password);
        fd.append("user_email", formData.user_email);
  
        async function fetchData() {
          const tokenContract = await getContract();
          console.log(tokenContract);
          const flag = await tokenContract.mint(
            formData.tier_wallet_address,
            intervention.token_amount
          );
          if (flag) {
            await axios
                // .post(BaseUrl + "/api/tier/create", fd)
              .post("/api/tier/create", fd)
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
                // alert("success");
                setOpenResultModal(true);
                // navigate(`/intervention/${interventionId}`);
              })
              .catch((error) => {
                alert(error.response.data.resp);
              });
          } else {
            alert("Failed the tier creation.");
          }
        }
        fetchData();
      } else {
        alert("Please connect your wallet address.");
      }
    };
    useEffect(() => {
      window.scrollTo(0, 0);
      async function fetchData() {
        const res = await axios.get(
          `/api/intervention/details/${interventionId}`
          // BaseUrl + `/api/intervention/details/${interventionId}`
        );
        const artWorkData = res.data.intervention;
        setIntervention(artWorkData);
      }
      fetchData();
    }, []);
  
    return (
      <>
        <Modal
          sx={{ zIndex: 500000 }}
          open={openResultModal}
          onClose={handleCloseResultModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openResultModal}>
            <Box
              bgcolor={darkMode ? "#171c26" : "#fff2f8"}
              style={{
                position: "relative",
                minHeight: "400px",
              }}
              className={
                !isMobile ? styles.modalStyleWeb : styles.modalStyleMobile
              }
            >
              <Typography
                className={styles.itemDetailsModalTitle}
                color="secondary"
                variant="h6"
                component="div"
              >
                <Typography component="span" color="secondary" sx={{ mt: 0.3 }}>
                  <HiTemplate fontSize={"1.5rem"} />
                </Typography>
                <Typography variant="h6" component="span" mt={-0.2}>
                  {t("TIER_CREATE_SUCCESS")}
                </Typography>
              </Typography>
              <Typography
                className={styles.itemDetailsModalTitle}
                color="secondary"
                variant="h6"
                component="div"
              >
                <Typography
                  variant="h6"
                  component="p"
                  mt={-0.2}
                  style={{
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <a
                    href="https://mumbai.polygonscan.com/address/0x7A6cdFF618DA6BAe64E47146102E4CeAff1286Eb"
                    target="_blank"
                    style={{
                      color: "#01d4f9",
                      fontSize: "20px",
                      position: "absolute",
                      left: "35%",
                      bottom: "100px",
                    }}
                  >
                    View on PolygonScan{" "}
                  </a>
                </Typography>
              </Typography>
              <BiUpArrowCircle
                style={{
                  color: "#01d4f9",
                  fontSize: "150px",
                  position: "absolute",
                  left: "35%",
                  top: "80px",
                }}
              />
  
              <GradientButtonSecondary
                onClick={handleCloseResultModal}
                style={{
                  position: "absolute",
                  bottom: "30px",
                  left: "42%",
                }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography variant="subtitle1" component="span">
                  Close
                </Typography>
              </GradientButtonSecondary>
            </Box>
          </Fade>
        </Modal>
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
                  {t("ADD_TIER")}
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
                          htmlFor="tier_name"
                        >
                          {t("TIER_NAME")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_NAME_HERE"
                          )}
                          name="tier_name"
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
                          {formError.tier_name}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="tier_description"
                        >
                          {t("DESCRIPTION")} *
                        </label>
                        <textarea
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_PROVIDE_A_DETAILED_DESCRIPTION_OF_THE_ITEM"
                          )}
                          name="tier_description"
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
                          {formError.tier_description}
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
                            "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_USER_NAME_HERE"
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
                            "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_USER_PASSWORD_HERE"
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
                            "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_USER_EMAIL_HERE"
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
                                  name="tier_image"
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
                    onClick={(e) => Create_tier(e)}
                  >
                    <Typography component="span" color="#ffffff">
                      <MdAddToPhotos />
                    </Typography>
                    <Typography variant="body2" component="span">
                      {t("ADD_TIER")}
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
                    {t("CREATE_ASSET")}
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
                          name="tier_image"
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
                    htmlFor="tier_name"
                  >
                    {t("TIER_NAME")} *
                  </label>
                  <input
                    className={darkMode ? "inputFieldMobile" : null}
                    type="text"
                    placeholder={t(
                      "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_NAME_HERE"
                    )}
                    name="tier_name"
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
                    htmlFor="tier_description"
                  >
                    {t("DESCRIPTION")} *
                  </label>
                  <textarea
                    placeholder={t(
                      "CREATE_ASSET_PLACEHOLDER_PROVIDE_A_DETAILED_DESCRIPTION_OF_THE_ITEM"
                    )}
                    name="tier_description"
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
                      "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_USER_NAME_HERE"
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
                      "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_USER_PASSWORD_HERE"
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
                      "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_USER_EMAIL_HERE"
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
                  onClick={(e) => Create_tier(e)}
                >
                  <Typography component="span" color="secondary">
                    <MdAddToPhotos />
                  </Typography>
                  <Typography variant="body2" component="span">
                    {t("ADD_TIER")}
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
  