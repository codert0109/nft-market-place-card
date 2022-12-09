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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

const Dashboard = ({ darkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [interventions, setInterventions] = useState([]);
  let [datas, setDatas] = useState([]);
  const [previousFilterData, setPreviousFillterData] = useState([]);
  const [changeInterventionName, setChangeInterventionName] = useState();
  const Add_User = () => {
    navigate(`/Register`);
  };
  const ChangeInterventionName = (e) => {
    console.log("data:", datas);
    if (e.target.value === "all") {
      setDatas(previousFilterData);
    } else {
      const data = previousFilterData.filter(
        (data) =>
          (data.user_role == "2" &&
            data.tier[0].intervention[0].name == e.target.value) ||
          (data.user_role == "3" &&
            data.company[0].tier[0].intervention[0].name == e.target.value)
      );
      console.log(data, e.target.value);
      setDatas(data);
    }
  };
  const onChange = (e) => {
    let data = previousFilterData.filter((data) =>
      data.user_name.includes(e.target.value)
    );
    setDatas(data);
  };
  const EditUser = (e, data) => {
    e.preventDefault();
    alert("!0");
    navigate("/edit", { state: data });
  };
  const DeleteUser = (e, data) => {
    e.preventDefault();
    async function deleteData() {
      // const res = await axios.delete(BaseUrl + `/api/users/delete/` + data._id);
      const res = await axios.delete(`/api/users/delete/` + data._id);
      if (res.data.resp == "User deleted") {
        async function fetchData() {
          // const res = await axios.get(BaseUrl + `/api/intervention/total`);
          const res = await axios.get(`/api/intervention/total`);
          const artWorkData = res.data.users;
          setPreviousFillterData(artWorkData);
          setDatas(artWorkData);
        }
        fetchData();
      } else {
        alert("Delete Failure");
      }
    }
    deleteData();
  };
  useEffect(() => {
    async function fetchData() {
      // const res = await axios.get(BaseUrl + `/api/intervention/total`);
      const res = await axios.get(`/api/intervention/total`);
      const artWorkData = res.data.users;
      setPreviousFillterData(artWorkData);
      setDatas(artWorkData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      // const res = await axios.get(BaseUrl + `/api/intervention/all`);
      const res = await axios.get(`/api/intervention/all`);
      const artWorkData = res.data.interventions;
      setInterventions(artWorkData);
    }
    fetchData();
  }, []);

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
              mt: 4,
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
            ></Typography>
          </Box>
          <Box
            bgcolor={darkMode ? "#171c26" : "#fff2f8"}
            sx={{
              px: 5,
              py: 5,
              borderRadius: "16px",
            }}
          >
            <Box
              bgcolor={darkMode ? "#040404" : "#ffffff"}
              sx={{
                p: 5,
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "16px",
              }}
            >
              <div style={{ display: "flex" }}>
                <Box component="form" sx={{ width: "100%", display: "flex" }}>
                  <Stack direction="column" spacing={2} sx={{ mb: 3, mr: 3 }}>
                    <input
                      className={darkMode && "inputField"}
                      type="text"
                      placeholder="Search Username"
                      name="searchText"
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
                  <Stack direction="column" spacing={2} sx={{ mb: 3, mr: 1 }}>
                    <select
                      className={darkMode ? "inputField" : null}
                      name="intervention_name"
                      onChange={(e) => ChangeInterventionName(e)}
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
                      <option key="0" value="all">
                        ALL
                      </option>
                      {interventions.map((data) => {
                        return (
                          <option key={data._id} value={data.name}>
                            {data.name}
                          </option>
                        );
                      })}
                    </select>
                  </Stack>
                </Box>
                <Stack alignItems="flex-end" spacing={2}>
                  <GradientButtonPrimary
                    type="button"
                    onClick={(e) => Add_User(e)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      width: "150px",
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
                      {t("ADD_USER")}
                    </Typography>
                  </GradientButtonPrimary>
                </Stack>
              </div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>User Name</TableCell>
                      <TableCell align="right">User Email</TableCell>
                      <TableCell align="right">Intervention</TableCell>
                      <TableCell align="right">Tier</TableCell>
                      <TableCell align="right">Company</TableCell>
                      <TableCell align="right">Credit Balance</TableCell>
                      <TableCell align="right">Edit/Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {datas &&
                      datas.map((data) => {
                        if (data.user_role == "1") {
                          return (
                            <TableRow
                              key={data._id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {data.user_name}
                              </TableCell>
                              <TableCell align="right">
                                {data.user_email}
                              </TableCell>
                              <TableCell align="right">admin</TableCell>
                              <TableCell align="right"></TableCell>
                              <TableCell align="right"></TableCell>
                              <TableCell align="right"></TableCell>
                              <TableCell align="right">
                                <EditIcon
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => EditUser(e, data)}
                                />
                                <DeleteForeverIcon
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => DeleteUser(e, data)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        } else if (data.user_role == "2") {
                          return (
                            <TableRow
                              key={data._id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {data.user_name}
                              </TableCell>
                              <TableCell align="right">
                                {data.user_email}
                              </TableCell>
                              <TableCell align="right">
                                {data.tier[0].intervention[0].name}
                              </TableCell>
                              <TableCell align="right">
                                {data.tier[0].tier_name}
                              </TableCell>
                              <TableCell align="right"></TableCell>
                              <TableCell align="right">
                                {data.tier[0].tier_token_amount}
                              </TableCell>
                              <TableCell align="right">
                                <EditIcon
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => EditUser(e, data)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        } else if (data.user_role == "3") {
                          return (
                            <TableRow
                              key={data._id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {data.user_name}
                              </TableCell>
                              <TableCell align="right">
                                {data.user_email}
                              </TableCell>
                              <TableCell align="right">
                                {data.company[0].tier[0].intervention[0].name}
                              </TableCell>
                              <TableCell align="right">
                                {data.company[0].tier[0].tier_name}
                              </TableCell>
                              <TableCell align="right">
                                {data.company[0].company_name}
                              </TableCell>
                              <TableCell align="right">
                                {data.company[0].company_token_amount}
                              </TableCell>
                              <TableCell align="right">
                                <EditIcon
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => EditUser(e, data)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        }
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
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
          ></Box>
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
                    type="text"
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
                    onClick={(e) => Add_User(e)}
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
              </Box>
            </Box>
          </Box>
        </div>
      )}
    </>
  );
};

export default Dashboard;
