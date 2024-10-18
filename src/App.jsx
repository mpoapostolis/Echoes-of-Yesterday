import React from "react";
import { Main } from "./pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
