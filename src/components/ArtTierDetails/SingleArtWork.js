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

// Custom Gradient button
import {
  GradientButtonPrimary,
  GradientButtonSecondary,
} from "../../Utils/GradientButtons/GradientButtons";
// import BaseUrl from "../../Utils/urls";

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

import { ROLE } from "../../constants";
import { getUser } from "../../services/user.service";
import { ethers } from "ethers";

export const getContract = async () => {
  const tokenAddress = "0x7A6cdFF618DA6BAe64E47146102E4CeAff1286Eb";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();

  const contractABI = require("../../Pages/CreateAssets/token.json");
  const tokenContract = new ethers.Contract(tokenAddress, contractABI, signer);
  return tokenContract;
};

const SingleArtWork = ({ fa, darkMode }) => {
  const {
    _id,
    intervention_id,
    tier_name,
    tier_description,
    tier_wallet_address,
    tier_token_amount,
    tier_is_claim,
    tier_image,
    tier_private_key,
  } = fa;

  const currentUser = getUser();

  const [tokenAmount, setTokenAmount] = React.useState(false);
  const [companyAddress, setCompanyAddress] = useState("");

  // States
  const [openModal, setOpenModal] = React.useState(false);
  const [openModal1, setOpenModal1] = React.useState(false);
  const [likeState, setLikeState] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(false);
  const [tabValue, setTabValue] = useState(0); // setting tab value for changing
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    firstTransfer: _id,
    secondTransfer: "",
    transferAmount: 0,
  });
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
  const allocateCompanyName = (e) => {
    for (let i = 0; i < companies.length; i++) {
      //   console.log(
      //     e.target.value,
      //     "company_address:",
      //     i,
      //     "::::",
      //     companies[i].company_wallet_address
      //   );
      if (companies[i]._id === e.target.value) {
        setCompanyAddress(companies[i].company_wallet_address);
      }
    }
    setFormData({ ...formData, secondTransfer: e.target.value });
  };
  const transfer_amount = (e) => {
    setFormData({ ...formData, transferAmount: e.target.value });
  };
  const transfer = (e) => {
    e.preventDefault();
    if (formData.transferAmount > 0) {
      async function fetchData() {
        const res = await axios.post(`/api/tier/allocate`, formData);
        // const res = await axios.post(BaseUrl + `/api/tier/allocate`, formData);
        if (res.data === "Success") {
          const tokenContract = await getContract();
          //   console.log(
          //     tokenContract,
          //     // tier_wallet_address,
          //     companyAddress,
          //     formData.transferAmount
          //   );
          await tokenContract.transfer(
            // tier_wallet_address,
            companyAddress,
            formData.transferAmount
          );
          setTokenAmount(tokenAmount - formData.transferAmount);
          alert("Allocate Success");
        } else {
          alert(res.data.resp);
        }
      }
      fetchData();
    }
  };
  const downloadTextFile = () => {
    const element = document.createElement("a");
    const file = new Blob([tier_private_key], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "myPrivateKey.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  useEffect(() => {
    if (intervention_id) {
      async function fetchData() {
        const res = await axios.get(`/api/company/${_id}`);
        // const res = await axios.get(BaseUrl + `/api/company/${_id}`);

        const artWorkData = res.data.companies;
        setCompanies(artWorkData);
        setFormData({
          ...formData,
          secondTransfer: 0,
        });
        setTokenAmount(tier_token_amount);
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
              {tier_description}
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
              {tier_wallet_address}
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
                onClick={() => window.history.back()}
                style={{ borderBottom: "0px" }}
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
          {!isMobile ? (
            <Box className={styles.detailsContainer}>
              <Box zIndex={10}>
                <img
                  className={styles.artDisplayImage}
                  src={"/upload/" + tier_image}
                  alt={tier_name}
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
                    {tier_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    lineHeight={1.5}
                    mb={2}
                    textAlign="justify"
                  >
                    {tier_description ? tier_description.slice(0, 20) : ""}
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
                      {tokenAmount}
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
                      {tier_wallet_address
                        ? tier_wallet_address.slice(0, 10)
                        : ""}
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
                  <Divider className={styles.dividerBox} />
                </Box>
                <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    htmlFor="allocation_token"
                  >
                    {t("companies")} *
                  </label>
                  <select
                    className={darkMode ? "inputField" : null}
                    placeholder={t(
                      "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_TOKEN_AMOUNT"
                    )}
                    name="transfer_token"
                    value={formData.secondTransfer}
                    onChange={(e) => allocateCompanyName(e)}
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      backgroundColor: `${darkMode ? "#171c26" : "#ffffff"}`,
                      width: "100%",
                      zIndex: 1000,
                    }}
                  >
                    <option value="0"></option>
                    {companies.map((data) => {
                      return (
                        <option key={data._id} value={data._id}>
                          {data.company_name}
                        </option>
                      );
                    })}
                  </select>
                </Stack>
                <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                  <label
                    style={{
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    htmlFor="transfer_token"
                  >
                    {t("TOKEN_AMOUNT")} *
                  </label>
                  <input
                    className={darkMode ? "inputField" : null}
                    type="number"
                    placeholder={t(
                      "CREATE_ASSET_PLACEHOLDER_ENTER_TIER_TOKEN_AMOUNT"
                    )}
                    name="transfer_token"
                    onChange={(e) => transfer_amount(e)}
                    required
                    style={{
                      fontSize: "14px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "6px",
                      padding: "1rem 1.5rem",
                      color: `${darkMode ? "#ffffff" : "#121212"}`,
                      backgroundColor: `${darkMode ? "#171c26" : "#ffffff"}`,
                      width: "80%",
                      zIndex: 1000,
                    }}
                  />
                </Stack>
                {currentUser && currentUser.role != ROLE.COMPANY ? (
                  <>
                    <Box className={styles.footerButtonContainer}>
                      <GradientButtonPrimary
                        className={styles.gradientButtonClass}
                        variant="contained"
                        onClick={(e) => transfer(e)}
                        sx={{ width: "100%" }}
                      >
                        <Typography
                          color="#ffffff"
                          component="span"
                          fontSize={20}
                          mt={0.5}
                        >
                          <IoCart />
                        </Typography>
                        <Typography variant="body1" component="span">
                          {t("Allocate")}
                        </Typography>
                      </GradientButtonPrimary>
                    </Box>
                    <GradientButtonSecondary
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        marginTop: "10px",
                        width: "100%",
                      }}
                      onClick={downloadTextFile}
                    >
                      <Typography variant="subtitle1" component="span">
                        {t("Download PrivateKey")}
                      </Typography>
                    </GradientButtonSecondary>
                  </>
                ) : (
                  <>
                    <Box className={styles.footerButtonContainer}>
                      <GradientButtonPrimary
                        disabled
                        className={styles.gradientButtonClass}
                        variant="contained"
                        onClick={(e) => transfer(e)}
                        sx={{ width: "100%" }}
                      >
                        <Typography
                          color="#ffffff"
                          component="span"
                          fontSize={20}
                          mt={0.5}
                        >
                          <IoCart />
                        </Typography>
                        <Typography variant="body1" component="span">
                          {t("Allocate")}
                        </Typography>
                      </GradientButtonPrimary>
                    </Box>
                    <GradientButtonSecondary
                      disabled
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        marginTop: "10px",
                        width: "100%",
                      }}
                      onClick={downloadTextFile}
                    >
                      <Typography variant="subtitle1" component="span">
                        {t("Download PrivateKey")}
                      </Typography>
                    </GradientButtonSecondary>
                  </>
                )}
              </Box>
            </Box>
          ) : (
            <Box className={styles.detailsContainerMobile}>
              <Box zIndex={10}>
                <img
                  className={styles.artDisplayImageMobile}
                  src={"/upload/" + tier_image}
                  alt={tier_name}
                />
              </Box>
              <Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    component="h2"
                    color="secondary.main"
                    mb={2}
                  >
                    {tier_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    lineHeight={1.8}
                    mb={2}
                    textAlign="left"
                  >
                    {/* {artworkDetails.slice(0, 200)} */}
                    {tier_description}
                    <Button
                      variant="text"
                      onClick={handleOpenModal}
                      sx={{
                        fontSize: "11px",
                        color: "#01D4FA",
                      }}
                    >
                      ...{t("READ_MORE")}
                    </Button>
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    component="p"
                    color={darkMode ? "#FFFFFF" : "#121212"}
                    mb={1}
                  >
                    {t("TOKEN_AMOUNT")}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="p"
                    color="secondary.main"
                    mb={1}
                    fontWeight={500}
                  >
                    {tokenAmount}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SingleArtWork;
