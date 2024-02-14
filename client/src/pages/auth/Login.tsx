import { useState, useEffect } from 'react'
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";

import {
  BoxCenter,
  ContainerScreenCenter,
  RoundedButtom,
  AuthForm,
  FormControlError,
  BoxAuthLink,
  CustomLink,
} from "../../utils/styles";
import { loginSchema, LoginForm } from "./validates/login.schema";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signIn } from "../../features/auth/authSlice";
import { Box } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>('')

  const { is_auth } = useAppSelector(state => state.persistedReducer.auth)
  useEffect(() => {
    if (is_auth) navigate('/')
  }, [is_auth])

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    } as LoginForm,
    validationSchema: loginSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (formData) => {
      await dispatch(signIn(formData))
        .unwrap()
        .then(({ user: { role } }) => role === 'guest' ? navigate('/chat') : navigate('/rooms'))
        .catch(({ message }) => setError(message))
    },
  });

  return (
    <ContainerScreenCenter maxWidth="sm">
      <BoxCenter>
        <Typography variant="h5" mb={6}>
          Login
        </Typography>
        <Typography variant="body1" mb={10} align="center">
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
              <FormHelperText>{formik.errors.username}</FormHelperText>
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
              <FormHelperText>{formik.errors.password}</FormHelperText>
            )}
          </FormControlError>

          <Box height={'15px'} display={'flex'} justifyContent={'center'}>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </Box>

          <RoundedButtom variant="contained" type="submit">
            Sign In
          </RoundedButtom>
        </AuthForm>
        <BoxAuthLink>
          <Typography>Don't have an account?</Typography>
          <CustomLink to={"/register"}>
            <Typography>Sign up here</Typography>
          </CustomLink>
        </BoxAuthLink>
      </BoxCenter>
    </ContainerScreenCenter>
  );
};

export default Login;
