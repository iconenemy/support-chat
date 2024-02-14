import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  IAuthState,
  ISignUpReq,
  ISignUpRes,
  ISignInReq,
  ISignInRes,
  IRefreshTokensRes,
  IError,
} from "./auth.type";
import { PURGE } from "redux-persist";
import { apiSlice } from "../../app/api/apiSlice";

export const signIn = createAsyncThunk<
  ISignInRes,
  ISignInReq,
  { rejectValue: IError }
>("auth/signInUser", async (loginDto, thunkApi) => {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginDto),
  });
  if (response.status !== 201) {
    return thunkApi.rejectWithValue((await response.json()) as IError);
  }
  return (await response.json()) as ISignInRes;
});

export const signUp = createAsyncThunk<
  ISignUpRes,
  ISignUpReq,
  { rejectValue: IError }
>("auth/signUpUser", async (signUpDto, thunkApi) => {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signUpDto),
  });
  if (response.status !== 200) {
    return thunkApi.rejectWithValue((await response.json()) as IError);
  }
  return (await response.json()) as ISignUpRes;
});

const initialState: IAuthState = {
  tokens: {
    access_token: "",
    refresh_token: "",
  },
  user: {
    _id: "",
    role: "guest",
    username: "",
  },
  loading: false,
  errors: {
    error: "",
  },
  is_auth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      initialState;
    },
    tokenReceived: (state, action: PayloadAction<IRefreshTokensRes>) => {
      state.is_auth = true;
      state.user = action.payload.user;
      state.tokens.access_token = action.payload.tokens.access_token;
      state.tokens.refresh_token = action.payload.tokens.refresh_token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.tokens.access_token = payload.tokens.access_token;
        state.tokens.refresh_token = payload.tokens.refresh_token;
        state.errors.error = "";
        state.is_auth = true;
      })
      .addCase(signIn.rejected, () => {})
      .addCase(signUp.fulfilled, (state, { payload }) => {
        state.user = payload;
      })
      .addCase(PURGE, () => initialState)
      .addMatcher(
        apiSlice.endpoints.refresh.matchFulfilled,
        (state, action: PayloadAction<IRefreshTokensRes>) => {
          state.is_auth = true;
          state.user = action.payload.user;
          state.tokens.access_token = action.payload.tokens.access_token;
          state.tokens.refresh_token = action.payload.tokens.refresh_token;
        }
      );
  },
});

export const { tokenReceived, logout } = authSlice.actions;

export default authSlice.reducer;
