import React from "react";
import {
    Avatar,
    Box,
    Divider,
    Grid,
    Grow,
    Stack,
    Typography,
} from "@mui/material";
import { HiOutlineClock } from "react-icons/hi";
import { AiOutlineHeart } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { GradientButtonPrimary } from "../../Utils/GradientButtons/GradientButtons";
import { MdAddToPhotos } from "react-icons/md";

import styles from "./ArtCard.module.css";

const ArtTierCard = ({ artWork, handleDetails, ViewDetails, darkMode }) => {
    const { _id, tier_image, tier_name, tier_token_amount, intervention_id } =
        artWork; // Getting the data from the props

    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <Grow in={true} style={{ transformOrigin: "0 0 0" }}>
            <Grid className={styles.artCard} item xs={1} sm={6} md={4}>
                <div className={styles.artCard}>
                    <Box className={styles.gradientBorderBox}>
                        <Box
                            className={styles.cardBody}
                            sx={{
                                boxShadow: `${
                                    !darkMode &&
                                    "0px 4px 4px rgba(0, 0, 0, 0.25)"
                                }`,
                            }}
                            bgcolor={darkMode ? "#121212" : "#ffffff"}
                            onClick={() => handleDetails(_id, intervention_id)}
                        >
                            <Box>
                                <img
                                    className={styles.imageStyle}
                                    src={"/upload/" + tier_image}
                                    alt={tier_name}
                                />
                            </Box>
                            <Box className={styles.artCardBody}>
                                <Typography
                                    variant="subtitle1"
                                    component="h2"
                                    color="secondary.main"
                                    mb={1}
                                    fontWeight={500}
                                >
                                    {tier_name}
                                </Typography>
                                <Box className={styles.artCardInfo}>
                                    <Typography
                                        variant="subtitle2"
                                        component="p"
                                        color="gray"
                                    >
                                        {t("TOKEN_AMOUNT")}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        component="p"
                                        color="secondary.main"
                                        fontWeight={500}
                                    >
                                        {tier_token_amount}
                                    </Typography>
                                </Box>
                                <Divider
                                    sx={{ my: 2 }}
                                    className={styles.dividerStyle}
                                />
                                <GradientButtonPrimary
                                    onClick={(e) =>
                                        ViewDetails(e, _id, intervention_id)
                                    }
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        color="#ffffff"
                                        component="span"
                                        mt={0.8}
                                    >
                                        <MdAddToPhotos />
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        component="span"
                                    >
                                        {t("VIEW_DETAIL")}
                                    </Typography>
                                </GradientButtonPrimary>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </Grid>
        </Grow>
    );
};

export default ArtTierCard;
