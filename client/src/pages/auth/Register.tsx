import { useState, useEffect } from 'react'
import { useFormik } from "formik";

import Typography from "@mui/material/Typography";

import {
  BoxCenter,
  ContainerScreenCenter,
  RoundedButtom,
  AuthForm,
  FormControlError,
  CustomLink,
  BoxAuthLink,
} from "../../utils/styles";
import { registerSchema, RegistrerForm } from "./validates/register.schema";
import { Box, FormHelperText, Input, InputLabel } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signUp } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [error, setError] = useState<string>('')

  const { is_auth } = useAppSelector(state => state.persistedReducer.auth)
  useEffect(() => {
    if (is_auth) navigate('/')
  }, [is_auth])

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    } as RegistrerForm,
    validationSchema: registerSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (formData) => {
      setError('')
      await dispatch(signUp(formData))
        .unwrap()
        .then(() => navigate('/login'))
        .catch(error => setError(error.message))
    },
  });

  return (
    <ContainerScreenCenter maxWidth="sm">
      <BoxCenter>
        <Typography variant="h5" mb={4}>
          Register
        </Typography>
        <Typography variant="body1" align="center" mb={9}>
          Our supports works 24/7 and they are always ready to help you with any
          issue
        </Typography>
        <AuthForm onSubmit={formik.handleSubmit}>
          <FormControlError
            error={!!formik.touched.username && !!formik.errors.username}
            variant="standard"
            fullWidth
          >
            <InputLabel required htmlFor="username">
              Username
            </InputLabel>
            <Input
              id="username"
              name="username"
              type="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            {formik.touched.username && formik.errors.username && (
              <FormHelperText>* {formik.errors.username}</FormHelperText>
            )}
          </FormControlError>

          <FormControlError
            error={!!formik.touched.password && !!formik.errors.password}
            variant="standard"
            fullWidth
          >
            <InputLabel required htmlFor="password">
              Password
            </InputLabel>
            <Input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText>* {formik.errors.password}</FormHelperText>
            )}
          </FormControlError>
          <Box height={'15px'} display={'flex'} justifyContent={'center'}>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </Box>

          <RoundedButtom variant="contained" type="submit">
            Sign Up
          </RoundedButtom>
        </AuthForm>
        <BoxAuthLink>
          <Typography>Already have an account?</Typography>
          <CustomLink to={"/login"}>
            <Typography>Sign in here</Typography>
          </CustomLink>
        </BoxAuthLink>
      </BoxCenter>
    </ContainerScreenCenter>
  );
};

export default Register;
