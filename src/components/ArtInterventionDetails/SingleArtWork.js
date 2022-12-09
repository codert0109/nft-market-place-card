import React, { useState, useEffect } from "react";
import axios from "axios";
// From Material UI
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Backdrop,
  Button,
  Divider,
  Fade,
  IconButton,
  Modal,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
// import BaseUrl from "../../Utils/urls";

// Custom Gradient button
import { GradientButtonPrimary } from "../../Utils/GradientButtons/GradientButtons";

// Icons
import { FiChevronLeft } from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlineClock } from "react-icons/hi";
import { BsFillBookmarkFill, BsBookmark, BsChevronDown } from "react-icons/bs";
import { HiTemplate } from "react-icons/hi";
import { IoCart } from "react-icons/io5";

import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";

// Styles
import styles from "./SingleArtWork.module.css";
// Icons
import { MdOutlineSaveAlt } from "react-icons/md";

import { ROLE } from "../../constants";
import { getUser } from "../../services/user.service";
import multiDownload from "multi-download";
import { Bars } from "react-loader-spinner";

const SingleArtWork = ({ fa, darkMode }) => {
  const {
    _id,
    tier_id,
    name,
    description,
    wallet_address,
    token_amount,
    image,
    file,
    nft_name,
    nft_description,
    nft_price,
    nft_image,
  } = fa;

  const currentUser = getUser();

  // States
  const [openLoader, setOpenLoader] = useState(false);

  const [openModal, setOpenModal] = React.useState(false);
  const [openModal1, setOpenModal1] = React.useState(false);
  const [likeState, setLikeState] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(false);
  const [tabValue, setTabValue] = useState(0); // setting tab value for changing
  const [intervention, setIntervention] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { t } = useTranslation();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal1 = () => setOpenModal1(true);
  const handleCloseModal1 = () => setOpenModal1(false);
  // Tab handler
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Custom Mobile Tabs
  const MobileTabs = styled(Tabs)({
    border: "none",
    backgroundColor: `${darkMode ? "#040404" : "#ffffff"}`,
    "& .MuiTabs-indicator": {
      backgroundColor: "inherit",
    },
  });

  const MobileTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
    "&.Mui-selected": {
      color: "#ffffff",
      backgroundColor: "#01D4FA",
      borderRadius: "4px",
      fontWeight: theme.typography.fontWeightMedium,
    },
  }));

  const DetailDownload = (intervention_id) => {
    setOpenLoader(true);
    async function FileDownload() {
      await axios
        .get("/api/intervention/download/" + intervention_id, {
          responseType: "arraybuffer",
        })
        // .get(
        //     BaseUrl + "/api/intervention/download/" + intervention_id,
        //     {
        //         responseType: "arraybuffer",
        //     }
        // )
        .then((response) => {
          setOpenLoader(false);
          const current_date = new Date();
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", current_date.getTime() + ".zip"); //or any other extension
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    FileDownload();
  };

  useEffect(() => {
    if (_id) {
      async function fetchData() {
        const res = await axios.get(`/api/intervention/details/${_id}`);
        // const res = await axios.get(
        //     BaseUrl + `/api/intervention/details/${_id}`
        // );
        const artWorkData = res.data.intervention;
        setIntervention(artWorkData);
      }
      fetchData();
    }
  }, []);
  return (
    // Artwork details information
    <>
      <Modal
        sx={{ zIndex: 500000 }}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            bgcolor={darkMode ? "#171c26" : "#fff2f8"}
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
                {t("ITEM_DETAILS")}
              </Typography>
            </Typography>
            <Typography
              // This is global styles
              className={
                !isMobile
                  ? styles.readMoreModalText
                  : styles.readMoreModalTextMobile
              }
              variant="body2"
              component="p"
              color="secondary"
              lineHeight={2}
              height={250}
              pr={2.5}
            >
              {description}
            </Typography>
          </Box>
        </Fade>
      </Modal>
      <Modal
        sx={{ zIndex: 500000 }}
        open={openModal1}
        onClose={handleCloseModal1}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal1}>
          <Box
            bgcolor={darkMode ? "#171c26" : "#fff2f8"}
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
                {t("ITEM_DETAILS")}
              </Typography>
            </Typography>
            <Typography
              // This is global styles
              className={
                !isMobile
                  ? styles.readMoreModalText
                  : styles.readMoreModalTextMobile
              }
              variant="body2"
              component="p"
              color="secondary"
              lineHeight={2}
              height={250}
              pr={2.5}
            >
              {wallet_address}
            </Typography>
          </Box>
        </Fade>
      </Modal>
      <Box mt={11} className={styles.detailsContainerBox}>
        <Box>
          {/* Top navigation */}
          {!isMobile ? (
            <Box className={styles.topNavigationBox}>
              <Typography
                className={styles.topNavigationTypo}
                component="div"
                borderBottom={`2px solid ${darkMode ? "#ffffff" : "#121212"}`}
                style={{ borderBottom: "0px" }}
                onClick={() => window.history.back()}
              >
                <FiChevronLeft fontSize={"1.5rem"} />
                <Typography
                  variant="h6"
                  component="p"
                  sx={{ cursor: "pointer" }}
                  zIndex={2}
                >
                  {t("ITEM_DETAILS")}
                </Typography>
                {darkMode && (
                  <Typography
                    variant="h1"
                    component="p"
                    ml={-3}
                    className={styles.labelHighLighter}
                  ></Typography>
                )}
              </Typography>
            </Box>
          ) : (
            <Box className={styles.topNavigationBoxMobile}>
              <Box
                width={"70px"}
                height={"60px"}
                mt={-1}
                bgcolor={`${darkMode ? "#040404" : "#ffffff"}`}
              ></Box>
              <Box
                sx={{
                  position: "fixed",
                  top: "3%",
                  zIndex: "10000",
                  width: "70%",
                  display: "flex",
                  justifyContent: "center",
                  ml: 4,
                }}
                style={{ borderBottom: "0px" }}
                onClick={() => window.history.back()}
              >
                <FiChevronLeft fontSize={"1.5rem"} />
                <Typography
                  component="div"
                  borderBottom={`2px solid ${darkMode ? "#ffffff" : "#121212"}`}
                  position="relative"
                  display="flex"
                  alignItems="center"
                  ml={4}
                >
                  <Typography
                    variant="subtitle1"
                    component="p"
                    sx={{ zIndex: 2 }}
                  >
                    {t("ITEM_DETAILS")}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          )}
          {/* Details container */}
          {!openLoader ? (
            <Box className={styles.detailsContainer}>
              <Box zIndex={10}>
                <img
                  className={styles.artDisplayImage}
                  src={"/upload/" + image}
                  alt={name}
                />
              </Box>
              <Box
                className={styles.detailsContainerContentBox}
                bgcolor={`${darkMode ? "#171C26" : "#FFF2F8"}`}
              >
                <Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    color="secondary.main"
                    mb={4}
                    fontWeight={500}
                  >
                    {name}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    lineHeight={1.5}
                    mb={2}
                    textAlign="justify"
                  >
                    {description ? description.slice(0, 20) : ""}
                    <Button
                      variant="text"
                      onClick={handleOpenModal}
                      sx={{
                        color: "#01D4FA",
                        textTransform: "lowercase",
                      }}
                    >
                      ...{t("READ_MORE")}
                    </Button>
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="p"
                      color={darkMode ? "#FFFFFF" : "#121212"}
                      mb={2}
                      fontWeight={500}
                    >
                      {t("TOKEN_AMOUNT")}
                    </Typography>
                    <Typography
                      variant="h5"
                      component="p"
                      color="secondary.main"
                      mb={3}
                      fontWeight={500}
                    >
                      {token_amount}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      component="p"
                      color={darkMode ? "#FFFFFF" : "#121212"}
                      mb={2}
                      fontWeight={500}
                    >
                      {t("WALLET_ADDRESS")}
                    </Typography>
                    <Typography
                      variant="h5"
                      component="p"
                      color="secondary.main"
                      mb={3}
                      fontWeight={500}
                    >
                      {wallet_address ? wallet_address.slice(0, 10) : ""}
                      <Button
                        variant="text"
                        onClick={handleOpenModal1}
                        sx={{
                          color: "#01D4FA",
                          textTransform: "lowercase",
                        }}
                      >
                        ...{t("READ_MORE")}
                      </Button>
                    </Typography>
                  </Box>
                  {currentUser && currentUser.role == ROLE.INVERTOR ? (
                    <Stack
                      alignItems="flex-end"
                      spacing={2}
                      style={{
                        float: "left",
                      }}
                    >
                      <GradientButtonPrimary
                        type="submit"
                        onClick={(e) => DetailDownload(_id)}
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
                          {t("DOWNLOAD")}
                        </Typography>
                      </GradientButtonPrimary>
                    </Stack>
                  ) : (
                    <Stack
                      alignItems="flex-end"
                      spacing={2}
                      style={{
                        float: "left",
                      }}
                    >
                      <GradientButtonPrimary
                        type="submit"
                        disabled
                        onClick={(e) => DetailDownload(_id)}
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
                          {t("DOWNLOAD")}
                        </Typography>
                      </GradientButtonPrimary>
                    </Stack>
                  )}

                  <Divider className={styles.dividerBox} />
                </Box>
              </Box>
            </Box>
          ) : (
            <div
              style={{
                marginTop: "150px",
                width: "100%",
                height: "100",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bars
                // type="ThreeDots"
                color="#5abfed"
                height="100"
                width="100"
              />
            </div>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SingleArtWork;
