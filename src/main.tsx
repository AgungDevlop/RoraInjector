import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Contact } from "./pages/Contact.tsx";
import { PlayVideo } from "./pages/PlayVideo.tsx";
import { Download } from "./pages/Download.tsx"; // Impor halaman Download
import Redirect from "./pages/Redirect.tsx"; // Impor komponen Redirect

const router = createBrowserRouter([
  {
    path: "/", // Rute utama
    element: <App />,
    children: [
      {
        path: ":id", // Rute dinamis berdasarkan ID
        element: <PlayVideo />,
      },
      {
        path: "e/:id", // Rute baru untuk format `/e/:id`
        element: <PlayVideo />,
      },
      {
        path: "download", // Rute untuk halaman Download
        element: <Download />,
      },
      {
        path: "contact", // Rute untuk halaman Contact
        element: <Contact />,
      },
      {
        path: "s/:id",
        element: <Redirect />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
