import { Link } from "react-router-dom";
import { styled } from "@mui/system";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";

import LockIcon from "@mui/icons-material/Lock";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

/** Container */
export const ContainerScreenCenter = styled(Container)({
  display: "flex",
  flexDirection: 'column',
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

/** Box */
export const BoxCenter = styled(Box)({
  background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "50px 130px",
  borderRadius: "30px",
  opacity: 0.8,
});

export const BoxFlexEnd = styled(Box)({
  width: "100%",
  marginBottom: "20px",
  display: "flex",
  alignItems: "flex-end",
});

export const BoxAuthLink = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: '10px'
});

/** Button */
export const RoundedButtom = styled(Button)({
  borderRadius: "25px",
  width: "100%",
});

/** Icon */
export const LockIconForm = styled(LockIcon)({
  color: "#7f7f7f",
  marginRight: 1,
  marginBottom: 2,
});

export const PermIdentityIconForm = styled(PermIdentityIcon)({
  color: "#7f7f7f",
  marginRight: 1,
  marginBottom: 2,
});

/** Form */
export const FormControlError = styled(FormControl)({
  height: "20px",
  marginBottom: "70px",
});

export const AuthForm = styled("form")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  marginBottom: '30px'
});

/** Link */
export const CustomLink = styled(Link)({
  textDecoration: "none",
});

/** Image */
export const Image = styled("img")({})