import "./index.css";

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "./app/store.ts";
import { Register, Layout, Login, Home, Chat } from "./pages/index.ts";
import { theme } from "./utils/theme/theme.ts";
import Rooms from "./pages/Rooms.tsx";
import NotFound from "./pages/NotFound.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: 'chat',
        element: <Chat />
      },
      {
        path: 'rooms',
        element: <Rooms />,
      },
      {
        path: 'not-found',
        element: <NotFound />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
