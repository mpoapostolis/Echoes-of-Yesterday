import React from "react";
import { Main } from "./pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Editor } from "./pages/editor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/editor",
    element: <Editor />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
