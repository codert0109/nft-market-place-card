import React, { useEffect, useState } from "react";

import { Container, Typography } from "@mui/material";

import axios from "axios";

import { useParams } from "react-router-dom";

// Single Artwork components
import SingleArtWork from "./SingleArtWork";
// Styles
import styles from "./ArtCardDetails.module.css";
// import BaseUrl from "../../Utils/urls";

const ArtInterventionDetails = ({ darkMode }) => {
  const { interventionId } = useParams(); // Read from url

  const [artWork, setArtWork] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `/api/intervention/details/${interventionId}`
      );
      // const res = await axios.get(
      //     BaseUrl + `/api/intervention/details/${interventionId}`
      // );
      const artWorkData = res.data.intervention;
      // console.log(artWorkData);
      setArtWork(artWorkData);
    }
    fetchData();
  }, []);

  return (
    <Container className={styles.artCardDetailsContainer}>
      <Typography variant="h3" color="secondary.main">
        <SingleArtWork darkMode={darkMode} key={artWork._id} fa={artWork} />
      </Typography>
    </Container>
  );
};

export default ArtInterventionDetails;
