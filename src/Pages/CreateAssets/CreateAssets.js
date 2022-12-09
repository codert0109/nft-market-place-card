import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Backdrop,
    Button,
    Divider,
    Fade,
    Grid,
    IconButton,
    Modal,
    Stack,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
  } from "@mui/material";
  
  // Gradient buttons
  import {
    GradientButtonPrimary,
    GradientButtonSecondary,
  } from "../../Utils/GradientButtons/GradientButtons";
  
  import { useTheme } from "@emotion/react";
  import { HiTemplate } from "react-icons/hi";
  import { Box } from "@mui/system";
  import React, { useEffect, useState } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  
  import { styled } from "@mui/material/styles";
  import AdapterDateFns from "@mui/lab/AdapterDateFns";
  import axios from "axios";
  // Icons
  import { TiTimes } from "react-icons/ti";
  import { MdAddToPhotos } from "react-icons/md";
  import { RiAddBoxFill } from "react-icons/ri";
  import { ImImage } from "react-icons/im";
  import { BiMenuAltLeft } from "react-icons/bi";
  import { BiUpArrowCircle } from "react-icons/bi";
  import { FaWallet } from "react-icons/fa";
  
  import AssetProperModal from "../../components/AssetPropertiesModal/AssetProperModal";
  
  import { useTranslation } from "react-i18next";
  import { LocalizationProvider, MobileDatePicker } from "@mui/lab";
  import AssetProperModalMobile from "../../components/AssetPropertiesModal/AssetProperModalMobile";
  import { ethers } from "ethers";
  import { Link } from "react-router-dom";
  import { pinJSONToIPFS, pinFileToIPFS } from "./pinata.js";
  
  // Styles
  import styles from "./createAssets.module.css";
  // import BaseUrl from "../../Utils/urls";
  import { Bars } from "react-loader-spinner";
  
  const Input = styled("input")({
    display: "none",
  });
  var intervention_pdf = [""];
  
  export const getContract = async () => {
    //   const contractAddress = "0x1E6F354147a21DC9ff925b7a9fC1AA17457464e3";
    // const polygonContractAddress = "0xCd04B411a1756e3c25B69c767c1a92e273d9C14F";
    const polygonContractAddress = "0xE862b0C6e2557E20d87E341f664859286c98Bd6A";
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
  
    // const contractABI = require("./contract.json");
    // const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
    const contractABI = require("./polygonContract.json");
    const polygonContract = new ethers.Contract(
      polygonContractAddress,
      contractABI,
      signer
    );
    return polygonContract;
  };
  const CreateAssets = ({ darkMode }) => {
    const wallet = ethers.Wallet.createRandom();
    const navigate = useNavigate();
    const [image1, setImage1] = useState(null);
    const [file1, setFile1] = useState([]);
    const [image2, setImage2] = useState(null);
  
    const [imageIpfsUri, setImageIpfsUri] = useState("");
    const [metaDataIpfsUri, setMetaDataIpfsUri] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
  
    const getWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        Promise.resolve(accounts[0]).then((value) => setWalletAddress(value));
      } else {
        console.log("cannot get wallet address");
      }
    };
  
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      token_amount: "",
      wallet_address: "",
      image: undefined,
      file: [],
      nft_name: "",
      nft_description: "",
      nft_price: "",
      nft_image: undefined,
      project_name: "",
      project_description: "",
      project_id: "",
      event_type: "",
      project_country: "",
      credit_type: "",
      methodology: "",
      value_chain: "",
      shed_name: "",
      beneficiary: "",
      reduction_purpose: "",
      country_of_consumption: "",
      vintage: "",
      verified_by: "",
      date_of_verification: "",
      date_of_issue: "",
    });
    const [formError, setFormError] = useState({
      name: "",
      description: "",
      token_amount: "",
      nft_name: "",
      nft_description: "",
      nft_price: "",
      project_name: "",
      project_description: "",
      project_id: "",
      event_type: "",
      project_country: "",
      credit_type: "",
      methodology: "",
      value_chain: "",
      shed_name: "",
      beneficiary: "",
      reduction_purpose: "",
      country_of_consumption: "",
      vintage: "",
      verified_by: "",
      date_of_verification: "",
      date_of_issue: "",
      image: "",
      file: "",
      nft_image: "",
    });
  
    // States
    const [openResultModal, setOpenResultModal] = React.useState(false);
    const [openLoader, setOpenLoader] = useState(false);
  
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
      let name_error = "";
      let description_error = "";
      let token_amount_error = "";
      let nft_name_error = "";
      let nft_description_error = "";
      let nft_price_error = "";
      let project_name_error = "";
      let project_description_error = "";
      let project_id_error = "";
      let event_type_error = "";
      let project_country_error = "";
      let credit_type_error = "";
      let methodology_error = "";
      let value_chain_error = "";
      let shed_name_error = "";
      let beneficiary_error = "";
      let reduction_purpose_error = "";
      let country_of_consumption_error = "";
      let vintage_error = "";
      let verified_by_error = "";
      let date_of_verification_error = "";
      let date_of_issue_error = "";
      let image_error = "";
      let intervention_uploadingFile_error = "";
      let nft_image_error = "";
  
      if (!formData.image) {
        image_error = "intervention image is invalid.";
        validate = false;
      }
      if (formData.file.length === 0) {
        intervention_uploadingFile_error =
          "intervention uploading files are invalid.";
        validate = false;
      }
      if (!formData.nft_image) {
        nft_image_error = "NFT image is invalid.";
        validate = false;
      }
  
      if (formData.name == "") {
        name_error = "intervention name is invalid.";
        validate = false;
      }
      if (formData.description == "") {
        description_error = "intervention description is invalid.";
        validate = false;
      }
      if (formData.token_amount == "") {
        token_amount_error = "intervention token_amount is invalid.";
        validate = false;
      }
      if (formData.nft_name == "") {
        nft_name_error = "nft name is invalid.";
        validate = false;
      }
      if (formData.nft_description == "") {
        nft_description_error = "nft description is invalid.";
        validate = false;
      }
      if (formData.nft_price == "") {
        nft_price_error = "nft price is invalid.";
        validate = false;
      }
      if (formData.project_name == "") {
        project_name_error = "project name is invalid.";
        validate = false;
      }
      if (formData.project_description == "") {
        project_description_error = "project description is invalid.";
        validate = false;
      }
      if (formData.project_id == "") {
        project_id_error = "project id is invalid.";
        validate = false;
      }
      if (formData.event_type == "") {
        event_type_error = "event type is invalid.";
        validate = false;
      }
      if (formData.project_country == "") {
        project_country_error = "project country is invalid.";
        validate = false;
      }
      if (formData.credit_type == "") {
        credit_type_error = "credit type is invalid.";
        validate = false;
      }
      if (formData.methodology == "") {
        methodology_error = "methodology is invalid.";
        validate = false;
      }
      if (formData.value_chain == "") {
        value_chain_error = "value chain is invalid.";
        validate = false;
      }
      if (formData.shed_name == "") {
        shed_name_error = "shed name is invalid.";
        validate = false;
      }
      if (formData.beneficiary == "") {
        beneficiary_error = "beneficiary is invalid.";
        validate = false;
      }
      if (formData.reduction_purpose == "") {
        reduction_purpose_error = "reduction purpose is invalid.";
        validate = false;
      }
      if (formData.country_of_consumption == "") {
        country_of_consumption_error = "country of cousumption is invalid.";
        validate = false;
      }
      if (formData.vintage == "") {
        vintage_error = "vintage is invalid.";
        validate = false;
      }
      if (formData.verified_by == "") {
        verified_by_error = "verified by is invalid.";
        validate = false;
      }
      if (formData.date_of_verification == "") {
        date_of_verification_error = "date of verification is invalid.";
        validate = false;
      }
      if (formData.date_of_issue == "") {
        date_of_issue_error = "date of issue is invalid.";
        validate = false;
      }
      setFormError({
        ...formError,
        name: name_error,
        description: description_error,
        token_amount: token_amount_error,
        nft_name: nft_name_error,
        nft_description: nft_description_error,
        nft_price: nft_price_error,
        project_name: project_name_error,
        project_description: project_description_error,
        project_id: project_id_error,
        event_type: event_type_error,
        project_country: project_country_error,
        credit_type: credit_type_error,
        methodology: methodology_error,
        value_chain: value_chain_error,
        shed_name: shed_name_error,
        beneficiary: beneficiary_error,
        reduction_purpose: reduction_purpose_error,
        country_of_consumption: country_of_consumption_error,
        vintage: vintage_error,
        verified_by: verified_by_error,
        date_of_verification: date_of_verification_error,
        date_of_issue: date_of_issue_error,
        image: image_error,
        file: intervention_uploadingFile_error,
        nft_image: nft_image_error,
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
    const handleOpenResultModal = () => setOpenResultModal(true);
    const handleCloseResultModal = () => {
      setOpenResultModal(false);
      navigate("/intervention");
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
  
    const deleteFile = (index) => {
      setFile1([...file1.slice(0, index), ...file1.slice(index + 1)]);
      console.log("111");
      setFormData({
        ...formData,
        file: [
          ...formData.file.slice(0, index),
          ...formData.file.slice(index + 1),
        ],
      });
    };
  
    const handleImageUpload = async (e) => {
      e.preventDefault();
      if (e.target.name === "image") {
        setImage1(URL.createObjectURL(e.target.files[0]));
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
      } else if (e.target.name === "file") {
        setFile1([...file1, URL.createObjectURL(e.target.files[0])]);
        setFormData({
          ...formData,
          file: [...formData.file, e.target.files[0]],
        });
      } else if (e.target.name === "nft_image") {
        setImageIpfsUri(
          await pinFileToIPFS(
            e.target.files[0],
            formData.nft_name,
            formData.nft_description,
            formData.nft_price
          )
        );
  
        setImage2(URL.createObjectURL(e.target.files[0]));
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
      }
      // setFormData({ ...formData, [e.target.name]: e.target.files[0] });
      // await getWallet();
    };
    const onChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const Create_intervention = async (e) => {
      e.preventDefault();
      let valid = formValidation();
      if (!valid) {
        return;
      } else {
        setOpenLoader(true);
      }
      if (localStorage.getItem("user_wallet")) {
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("description", formData.description);
        fd.append("token_amount", formData.token_amount);
        fd.append("project_name", formData.project_name);
        fd.append("project_description", formData.project_description);
        fd.append("project_id", formData.project_id);
        fd.append("event_type", formData.event_type);
        fd.append("project_country", formData.project_country);
        fd.append("credit_type", formData.credit_type);
        fd.append("methodology", formData.methodology);
        fd.append("value_chain", formData.value_chain);
        fd.append("shed_name", formData.shed_name);
        fd.append("beneficiary", formData.beneficiary);
        fd.append("reduction_purpose", formData.reduction_purpose);
        fd.append("country_of_consumption", formData.country_of_consumption);
        fd.append("vintage", formData.vintage);
        fd.append("verified_by", formData.verified_by);
        fd.append("date_of_verification", formData.date_of_verification);
        fd.append("date_of_issue", formData.date_of_issue);
        fd.append("wallet_address", localStorage.getItem("user_wallet"));
        fd.append("image", formData.image);
        const intervention_ipfs = await pinFileToIPFS(
          formData.image,
          formData.name,
          formData.description,
          formData.token_amount
        );
        // console.log("intervention_ipfs:", intervention_ipfs);
        for (let i = 0; i < formData.file.length; i++) {
          fd.append("file[]", formData.file[i]);
          intervention_pdf[i] = await pinFileToIPFS(
            formData.file[i],
            formData.name,
            formData.description,
            formData.token_amount
          );
          // console.log("https://gateway.pinata.cloud/ipfs/", intervention_pdf[i]);
        }
        // fd.append("file", formData.file);
        fd.append("nft_name", formData.nft_name);
        fd.append("nft_description", formData.nft_description);
        fd.append("nft_price", formData.nft_price);
        fd.append("nft_image", formData.nft_image);
        async function fetchData() {
          setMetaDataIpfsUri(
            await pinJSONToIPFS(
              imageIpfsUri,
              intervention_ipfs,
              formData.nft_name,
              formData.nft_description,
              formData.nft_price,
              intervention_pdf,
              formData.project_name,
              formData.project_description,
              formData.project_id,
              formData.event_type,
              formData.project_country,
              formData.credit_type,
              formData.methodology,
              formData.value_chain,
              formData.shed_name,
              formData.beneficiary,
              formData.reduction_purpose,
              formData.country_of_consumption,
              formData.vintage,
              formData.verified_by,
              formData.date_of_verification,
              formData.date_of_issue
            )
          );
  
          const contract = await getContract();
          // console.log(contract);
          const getGasLimitSetBaseUri = await contract.estimateGas.setBaseURI(
            metaDataIpfsUri
          );
          const getGasLimitMintToken = await contract.estimateGas.mintToken(
            localStorage.getItem("user_wallet")
          );
          const flag1 = await contract.setBaseURI(metaDataIpfsUri, {
            gasLimit: getGasLimitSetBaseUri,
          });
          const flag2 = await contract.mintToken(
            localStorage.getItem("user_wallet"),
            { gasLimit: getGasLimitMintToken }
          );
          if (flag1 && flag2) {
            console.log("flag", flag1, flag2);
            await axios
              .post("/api/intervention/create", fd)
              // .post(BaseUrl + "/api/intervention/create", fd)
              .then((res) => {
                setOpenLoader(false);
                setOpenResultModal(true);
              })
              .catch((error) => {
                alert(error.response.data.resp);
              });
          } else {
            alert("Failed the intervention creation.");
          }
        }
        fetchData();
      } else {
        alert("Please connect your wallet address.");
      }
    };
    useEffect(() => {
      window.scrollTo(0, 0);
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
                  {t("TRANSACTION_SIBMITTED")}
                </Typography>
              </Typography>
              <Typography
                className={styles.itemDetailsModalTitle}
                color="secondary"
                variant="h6"
                component="div"
                style={{
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <BiUpArrowCircle
                  style={{
                    color: "#01d4f9",
                    fontSize: "150px",
                    left: "35%",
                    top: "80px",
                  }}
                />
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
                    href="https://mumbai.polygonscan.com/address/0xE862b0C6e2557E20d87E341f664859286c98Bd6A"
                    target="_blank"
                    style={{
                      color: "#01d4f9",
                      fontSize: "20px",
                      left: "35%",
                      bottom: "100px",
                    }}
                  >
                    View on PolygonScan{" "}
                  </a>
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  mt={-0.2}
                  style={{
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {/* {intervention_pdf.map(function (item, index) {
                    return ( */}
                  <a
                    // key={index}
                    // href={`https://gateway.pinata.cloud/ipfs/${item}`}
                    href={`https://gateway.pinata.cloud/ipfs/${metaDataIpfsUri}`}
                    target="_blank"
                    style={{
                      color: "#01d4f9",
                      fontSize: "20px",
                      left: "35%",
                      bottom: "100px",
                      display: "block",
                    }}
                  >
                    {/* Uploaded File{index + 1} */}
                    MetaDataUrl
                  </a>
                  {/* );
                  })} */}
                </Typography>
              </Typography>
  
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
        {openLoader ? (
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
        ) : (
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
                  {t("CREATE_INTERVENTION")}
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
                      <Stack direction="column" spacing={2}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="name"
                        >
                          {t("INTERVENTION_NAME")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_ENTER_INTERVENTION_NAME_HERE"
                          )}
                          name="name"
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
                          {formError.name}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="description"
                        >
                          {t("INTERVENTION_DESCRIPTION")} *
                        </label>
                        <textarea
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_ENTER_INTERVENTION_DESCRIPTION_HERE"
                          )}
                          name="description"
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
                          {formError.description}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="token_amount"
                        >
                          {t("TOKEN_AMOUNT")} *
                        </label>
                        <Stack direction="row" spacing={-9.5}>
                          <input
                            className={darkMode ? "inputField" : null}
                            type="number"
                            placeholder={t(
                              "CREATE_ASSET_PLACEHOLDER_TOKEN_AMOUNT"
                            )}
                            name="token_amount"
                            onChange={onChange}
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
                        </Stack>
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                          }}
                        >
                          {formError.token_amount}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="nft_name"
                        >
                          {t("NFT_NAME")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_ENTER_NFT_NAME_HERE"
                          )}
                          name="nft_name"
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
                          {formError.nft_name}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="nft_description"
                        >
                          {t("DESCRIPTION")} *
                        </label>
                        <textarea
                          placeholder={t(
                            "CREATE_ASSET_PLACEHOLDER_PROVIDE_A_DETAILED_DESCRIPTION_OF_THE_ITEM"
                          )}
                          name="nft_description"
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
                          {formError.nft_description}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="nft_price"
                        >
                          {t("PRICE")} *
                        </label>
                        <Stack direction="row" spacing={-9.5}>
                          <input
                            className={darkMode ? "inputField" : null}
                            type="number"
                            placeholder={t(
                              "CREATE_ASSET_PLACEHOLDER_ENTER_NFT_BASE_PRICE"
                            )}
                            name="nft_price"
                            onChange={onChange}
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
                        </Stack>
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                          }}
                        >
                          {formError.nft_price}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="project_name"
                        >
                          {t("Project name")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t("Enter project name")}
                          name="project_name"
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
                          {formError.project_name}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="project_description"
                        >
                          {t("Project Description")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t("Enter project description")}
                          name="project_description"
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
                          {formError.project_description}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="project_id"
                        >
                          {t("Project ID")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t("Enter project id")}
                          name="project_id"
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
                          {formError.project_id}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="event_type"
                        >
                          {t("Event Type")} *
                        </label>
                        <select
                          className={darkMode ? "inputField" : null}
                          name="event_type"
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
                            width: "100%",
                            zIndex: 1000,
                          }}
                        >
                          <option value="0"></option>
                          <option value="1">ALL</option>
                          <option value="2">One</option>
                        </select>
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                          }}
                        >
                          {formError.event_type}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="project_country"
                        >
                          {t("Project Country")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t("Enter Project Country")}
                          name="project_country"
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
                          {formError.project_country}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="credit_type"
                        >
                          {t("Credit Type")} *
                        </label>
                        <select
                          className={darkMode ? "inputField" : null}
                          name="credit_type"
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
                            width: "100%",
                            zIndex: 1000,
                          }}
                        >
                          <option value="0"></option>
                          <option value="1">ALL</option>
                          <option value="2">One</option>
                        </select>
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                          }}
                        >
                          {formError.credit_type}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="methodology"
                        >
                          {t("Methodology")} *
                        </label>
                        <select
                          className={darkMode ? "inputField" : null}
                          name="methodology"
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
                            width: "100%",
                            zIndex: 1000,
                          }}
                        >
                          <option value="0"></option>
                          <option value="1">ALL</option>
                          <option value="2">One</option>
                        </select>
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                          }}
                        >
                          {formError.methodology}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="value_chain"
                        >
                          {t("Value Chain")} *
                        </label>
                        <select
                          className={darkMode ? "inputField" : null}
                          name="value_chain"
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
                            width: "100%",
                            zIndex: 1000,
                          }}
                        >
                          <option value="0"></option>
                          <option value="1">ALL</option>
                          <option value="2">One</option>
                        </select>
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                          }}
                        >
                          {formError.value_chain}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="shed_name"
                        >
                          {t("Shed Name")} *
                        </label>
                        <select
                          className={darkMode ? "inputField" : null}
                          name="shed_name"
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
                            width: "100%",
                            zIndex: 1000,
                          }}
                        >
                          <option value="0"></option>
                          <option value="1">ALL</option>
                          <option value="2">One</option>
                        </select>
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                          }}
                        >
                          {formError.shed_name}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="beneficiary"
                        >
                          {t("Beneficiary")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t("Enter Beneficiary")}
                          name="beneficiary"
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
                          {formError.beneficiary}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="reduction_purpose"
                        >
                          {t("Reduction Purpose")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t("Enter reduction_purpose")}
                          name="reduction_purpose"
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
                          {formError.reduction_purpose}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="country_of_consumption"
                        >
                          {t("Country of Consumption")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t("Enter country_of_consumption")}
                          name="country_of_consumption"
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
                          {formError.country_of_consumption}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="vintage"
                        >
                          {t("Vintage")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t("Enter Vintage")}
                          name="vintage"
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
                          {formError.vintage}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="verified_by"
                        >
                          {t("Verified By")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="text"
                          placeholder={t("Enter Verified_by")}
                          name="verified_by"
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
                          {formError.verified_by}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="date_of_verification"
                        >
                          {t("Date of Verification")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="date"
                          placeholder={t("Enter Date of verification")}
                          name="date_of_verification"
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
                          {formError.date_of_verification}
                        </span>
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                        <label
                          style={{
                            color: `${darkMode ? "#ffffff" : "#121212"}`,
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          htmlFor="date_of_issue"
                        >
                          {t("Date of issue")} *
                        </label>
                        <input
                          className={darkMode ? "inputField" : null}
                          type="date"
                          placeholder={t("Enter Date of issue")}
                          name="date_of_issue"
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
                          {formError.date_of_issue}
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
                        {t("UPLOAD_INTERVENTION_IMAGE(PNG,JPEG/SVG)")}
                      </Typography>
                      <Box>
                        <Box>
                          {!image1 ? (
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
                              <label htmlFor="icon-button-file-front1">
                                <Input
                                  accept="image/*"
                                  id="icon-button-file-front1"
                                  type="file"
                                  name="image"
                                  onChange={(e) => handleImageUpload(e)}
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
                                  onClick={() => setImage1(null)}
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
                                  src={image1}
                                  alt="Uploaded"
                                />
                              </Box>
                            </Box>
                          )}
                        </Box>
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                          }}
                        >
                          {formError.image}
                        </span>
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        color="secondary"
                        variant="body2"
                        component="p"
                        fontWeight={500}
                      >
                        {t("UPLOAD_INTERVENTION_FILE(PDF,DOC,TXT)")}
                      </Typography>
                      <Box>
                        <Box>
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
                            <label htmlFor="icon-button-file-front2">
                              <Input
                                accept="file/*"
                                id="icon-button-file-front2"
                                type="file"
                                name="file"
                                onChange={(e) => handleImageUpload(e)}
                              />
                              <IconButton
                                color="primary"
                                aria-label="upload file"
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
  
                          {file1.map(function (temp_file, index) {
                            return (
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
                                    onClick={() => deleteFile(index)}
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
                                  <iframe
                                    style={{
                                      height: "200px",
                                      width: "315px",
                                    }}
                                    src={temp_file}
                                    alt="Uploaded"
                                  />
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                            marginBottom: "10px",
                          }}
                        >
                          {formError.file}
                        </span>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 5 }}>
                      <Typography
                        color="secondary"
                        variant="body2"
                        component="p"
                        fontWeight={500}
                      >
                        {t("UPLOAD_NFT_IMAGE(PNG,JPEG/SVG)")}
                      </Typography>
                      <Box>
                        <Box>
                          {!image2 ? (
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
                              <label htmlFor="icon-button-file-front3">
                                <Input
                                  accept="image/*"
                                  id="icon-button-file-front3"
                                  type="file"
                                  name="nft_image"
                                  onChange={(e) => handleImageUpload(e)}
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
                                  onClick={() => setImage2(null)}
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
                                  src={image2}
                                  alt="Uploaded"
                                />
                              </Box>
                            </Box>
                          )}
                        </Box>
  
                        <span
                          className="error"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginTop: "0px",
                            marginBottom: "10px",
                          }}
                        >
                          {formError.nft_image}
                        </span>
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
                    onClick={(e) => Create_intervention(e)}
                  >
                    <Typography component="span" color="#ffffff">
                      <MdAddToPhotos />
                    </Typography>
                    <Typography variant="body2" component="span">
                      {t("CREATE_INTERVENTION")}
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
        )}
      </>
    );
  };
  
  export default CreateAssets;
  